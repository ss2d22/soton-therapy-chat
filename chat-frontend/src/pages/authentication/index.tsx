import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";
import Menu from "@/components/menu.tsx";

const Auth = () => {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
          <LoginForm />
      </div>
    </div>
  );
};

export default Auth;
