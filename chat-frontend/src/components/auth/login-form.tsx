import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { usePostSignInMutation, usePostSignUpMutation } from "@/state/api/authApi";
import { AppDispatch, AuthApiResponse } from "@/types";
import { useDispatch } from "react-redux";
import { setUserInfo } from "@/state/slices/authSlice";
import { useNavigate } from "react-router-dom";

//import { toast } from "sonner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const navigator = useNavigate();

    const [triggerSignUp] = usePostSignUpMutation();
  const [triggerSignIn] = usePostSignInMutation();
    const dispatch: AppDispatch = useDispatch();

  const validateSignUp = (): boolean => {
    return true;
    // if (!email.length) {
    //   toast.error("email is required");
    //   return false;
    // }
    // if (!password.length) {
    //   toast.error("password is reqruied");
    //   return false;
    // }
    // if (repeatPassword !== password) {
    //   toast.error("passwords don't match");
    //   return false;
    // }
    // return true;
  };

  const handleSignUp = async () => {
    try {
      if (validateSignUp()) {
        const result = (await triggerSignUp({
          email,
          password,
        })) as AuthApiResponse;
        if (result && result.data.user.id) {
          dispatch(setUserInfo(result.data.user));
        }
        navigator("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateSignIn = (): boolean => {
    return true;
    // if (!email.length) {
    //   toast.error("email is required");
    //   return false;
    // }
    // if (!password.length) {
    //   toast.error("password is required");
    //   return false;
    // }
    // return true;
  };

  const handleLogIn = async () => {
    try {
      if (validateSignIn()) {
        const result = (await triggerSignUp({
          email,
          password,
        })) as AuthApiResponse;
        if (result && result.data.user.id) {
          dispatch(setUserInfo(result.data.user));
        }
        navigator("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const LoginCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={handleLogIn}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="x@soton.ac.uk"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a
                onClick={() => setIsLogin(false)}
                className="underline underline-offset-4"
              >
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };

  const RegisterCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Register a new account</CardTitle>
          <CardDescription>
            Enter your university email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="register-form" onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="x@soton.ac.uk"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Repeat password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  id="password-repeat"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a
                onClick={() => setIsLogin(true)}
                className="underline underline-offset-4"
              >
                Log In
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {isLogin ? <LoginCard /> : <RegisterCard />}
    </div>
  );
}
