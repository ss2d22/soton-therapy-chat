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
import {LOGIN_URL} from "@/constants";

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
    //return true;
    if (!email.length) {
      alert("email is required");
      return false;
    }
    if (!password.length) {
      alert("password is required");
      return false;
    }
    if (repeatPassword !== password) {
      alert("the two passwords you entered don't match");
      return false;
    }
    return true;
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      if (validateSignUp()) {
        console.log("posting signup to " + LOGIN_URL);
        const result = (await triggerSignUp({
          email,
          password,
        })) as AuthApiResponse;
        if ("data" in result && result.data.user.id) {
          dispatch(setUserInfo(result.data.user));
          navigator("/");
        } else {
          if ("error" in result) {
            alert(result.error.data.error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateSignIn = (): boolean => {
    if (!email.length) {
      alert("email is required");
      return false;
    }
    if (!password.length) {
      alert("password is required");
      return false;
    }
    return true;
  };

  const handleLogIn = async (event) => {
    event.preventDefault();
    try {
      if (validateSignIn()) {
        const result = (await triggerSignIn({
          email,
          password,
        })) as AuthApiResponse;
        if ("data" in result && result.data.user.id) {
          dispatch(setUserInfo(result.data.user));
          navigator("/");
        } else
          {
            //console.log(JSON.stringify(result));
            if ("error" in result) {
              alert(result.error.data.error);
            }
          }
      }
    } catch (error) {
      //alert(error.message);
      console.log(error);
    }
  };


  return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        {isLogin ? (
            <LoginCard email={email} setEmail={setEmail} password={password} setPassword={setPassword} setIsLogin={setIsLogin} handleLogIn={handleLogIn} />
        ) : (
            <RegisterCard email={email} setEmail={setEmail} password={password} setPassword={setPassword} repeatPassword={repeatPassword} setRepeatPassword={setRepeatPassword} setIsLogin={setIsLogin} handleSignUp={handleSignUp} />
        )}
      </div>
  );
}


const LoginCard = ({ email, setEmail, password, setPassword, setIsLogin, handleLogIn }) => (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleLogIn}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email1">Email</Label>
              <Input id="email1" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="x@soton.ac.uk" required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password1">Password</Label>
              <Input id="password1" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a style={{ cursor: "pointer" }} onClick={() => setIsLogin(false)} className="underline underline-offset-4">Sign up</a>
          </div>
        </form>
      </CardContent>
    </Card>
);

const RegisterCard = ({ email, setEmail, password, setPassword, repeatPassword, setRepeatPassword, setIsLogin, handleSignUp }) => (
    <Card>
      <CardHeader>
        <CardTitle>Register a new account</CardTitle>
        <CardDescription>Enter your university email below to sign up</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={handleSignUp}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email2">Email</Label>
              <Input id="email2" type="email" placeholder="x@soton.ac.uk" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password2">Password</Label>
              <Input id="password2" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="password-repeat2">Repeat password</Label>
              <Input id="password-repeat2" type="password" required value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} />
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <a style={{ cursor: "pointer" }} onClick={() => setIsLogin(true)} className="underline underline-offset-4">Log In</a>
          </div>
        </form>
      </CardContent>
    </Card>
);
