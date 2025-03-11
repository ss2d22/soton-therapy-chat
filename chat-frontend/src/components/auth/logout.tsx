import {Button} from "@/components/ui/button.tsx";
import {AppDispatch, signOutResponse} from "@/types";
import {useDispatch} from "react-redux";
import {setUserInfo} from "@/state/slices/authSlice.ts";
import {usePostLogOutMutation} from "@/state/api/authApi.ts";
import {useNavigate} from "react-router-dom";


const LogoutButton = () => {
    const [triggerSignOut] = usePostLogOutMutation();
    const dispatch: AppDispatch = useDispatch();
    const navigator = useNavigate();

    const handleSignOut = async () => {
        console.log("in signout");

        const result = (await triggerSignOut({})) as signOutResponse;
        if ("data" in result && result.data.message) {
            navigator("/authentication");
            dispatch(setUserInfo(undefined));
        }
    };

    return (
        <Button onClick={handleSignOut}>
            Logout
        </Button>
    );
}

export default LogoutButton;