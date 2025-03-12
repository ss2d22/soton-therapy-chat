import Menu from "@/components/menu";
import ModelsList from "@/components/chat/modelsList";
import NewChat from "@/components/chat/newChat.tsx";
import ChatList from "@/components/chat/chatList.tsx";
import ChatContainer from "@/components/chat/chatContainer.tsx";

const Chat = () => {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Menu/>
            <ChatContainer />
            {/*<ModelsList />*/}
            <div className="w-full max-w-sm">
            </div>
        </div>
    );
};

export default Chat;
