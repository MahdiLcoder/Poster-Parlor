import { StackFrame } from '@poster-parlor-api/shared';

export function parseStackTrace(error: Error, limit = 3): StackFrame[] {
  if (!error.stack) return [];

  const lines = error.stack.split('\n');
  const frames: StackFrame[] = [];

  // Skip the first line (error message)
  for (let i = 1; i < lines.length && frames.length < limit; i++) {
    const line = lines[i].trim();

    // Match patterns like:
    // at FunctionName (path/to/file.ts:line:column)
    // at path/to/file.ts:line:column
    const match = line.match(/at\s+(?:(.+?)\s+\()?(.+?):(\d+):(\d+)\)?/);

    if (match) {
      const [, funcName, filePath, lineNum, colNum] = match;

      // Extract only the relevant part of the file path
      const cleanPath = filePath
        .split(/[/\\]/)
        .slice(-3) // Last 3 parts: folder/subfolder/file.ts
        .join('/');

      // Skip node_modules entries
      if (cleanPath.includes('node_modules')) continue;

      frames.push({
        function: funcName?.trim() || 'anonymous',
        file: cleanPath,
        line: parseInt(lineNum, 10),
        column: parseInt(colNum, 10),
      });
    }
  }

  return frames;
}
