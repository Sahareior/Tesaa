import { SignIn } from "@clerk/clerk-react";

export const LoginPage = () => {
  return (
     <div className="flex h-screen justify-center items-center">
      <SignIn />
    </div>
  );
};