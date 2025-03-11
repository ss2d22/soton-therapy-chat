import Menu from "@/components/menu";
import ModelsList from "@/components/chat/modelsList";

const Chat = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Menu/>
            <ModelsList />
            <div className="w-full max-w-sm">
            </div>
        </div>
    );
};

export default Chat;
