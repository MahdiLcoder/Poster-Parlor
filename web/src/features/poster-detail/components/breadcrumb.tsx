interface BreadcrumbProps {
  category: string;
  title: string;
}

export const Breadcrumb = ({ category, title }: BreadcrumbProps) => {
  return (
    <nav className="text-sm mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-muted-foreground">
        <li className="hover:text-foreground cursor-pointer">Home</li>
        <li>/</li>
        <li className="capitalize hover:text-foreground cursor-pointer">
          {category}
        </li>
        <li>/</li>
        <li className="text-foreground font-medium truncate">{title}</li>
      </ol>
    </nav>
  );
};
