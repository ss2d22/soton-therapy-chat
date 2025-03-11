import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppDispatch, AuthApiResponse } from "@/types";
import { useDispatch } from "react-redux";
import {selectUserInfo, setUserInfo} from "@/state/slices/authSlice";

//import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Menu from "@/components/menu";


const UserProfile: React.FC = () => {
    const navigator = useNavigate();
    const user = useSelector(selectUserInfo);
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const dispatch: AppDispatch = useDispatch();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <Menu />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>User Profile</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    {/*<Avatar className="w-20 h-20">*/}
                    {/*    <AvatarImage src={user.avatar || "https://via.placeholder.com/100"} alt="User Avatar" />*/}
                    {/*    <AvatarFallback>{user.firstName.charAt(0) || "?"}</AvatarFallback>*/}
                    {/*</Avatar>*/}

                    <div className="w-full">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={user.email} readOnly />
                    </div>

                    <div className="flex gap-2 w-full">
                        <div className="flex-1">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" value={user.firstName} placeholder="Enter first name" />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" value={user.lastName} placeholder="Enter last name" />
                        </div>
                    </div>

                    {/*<div className="flex justify-between items-center w-full">*/}
                    {/*    <Label>Dark Mode</Label>*/}
                    {/*    <Switch checked={user.theme === 1} />*/}
                    {/*</div>*/}

                    {/*<div className="flex justify-between items-center w-full">*/}
                    {/*    <Label>Profile Configured</Label>*/}
                    {/*    <Switch checked={user.configuredProfile} />*/}
                    {/*</div>*/}

                    <Button>Save Changes</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserProfile;
