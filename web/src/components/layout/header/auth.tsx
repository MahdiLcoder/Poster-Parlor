import { GoogleSignInButtonProps } from "@/types/components.type";

import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { useLoginWithGoogleMutation } from "@/store/api/auth.api";
import { ErrorResponse } from "@/types/api-response.type";

export function GoogleSignInButton({}: GoogleSignInButtonProps) {
  const [loginWithGoogle] = useLoginWithGoogleMutation();
  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse | null
  ) => {
    const idToken = credentialResponse?.credential;

    if (idToken) {
      try {
        const result = await loginWithGoogle(idToken).unwrap();

        if (result) {
          toast.success("Logged In");
        }
      } catch (err: unknown) {
        const error = err as ErrorResponse;
        toast.error(error.data.message);
      }
    }
  };
  return (
    <div className="cursor-pointer">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => {
          toast.error("Google sign-in failed");
        }}
        type="standard"
        size="large"
      />
    </div>
  );
}
