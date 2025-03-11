import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logout from "@/components/auth/logout.tsx";

const Menu = () => {
    const navigate = useNavigate();

    return (
        <NavigationMenu className="fixed top-0 left-0 w-full shadow-md z-50 p-3">
            <NavigationMenuList className="flex justify-end space-x-4 px-4">
                <NavigationMenuItem>
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-gray-700"
                        onClick={() => navigate("/chat")}
                    >
                        Chat
                    </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Button
                        variant="ghost"
                        className="text-white hover:bg-gray-700"
                        onClick={() => navigate("/userprofile")}
                    >
                        Profile
                    </Button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <Logout />
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}

export default Menu;
