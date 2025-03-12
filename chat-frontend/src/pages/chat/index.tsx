import Menu from "@/components/menu";
import ModelsList from "@/components/chat/modelsList";
import NewChat from "@/components/chat/newChat.tsx";
import ChatList from "@/components/chat/chatList.tsx";
import ChatContainer from "@/components/chat/chatContainer.tsx";

const Chat = () => {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <Menu/>
            <ChatContainer />
            {/*<ModelsList />*/}
        </div>
    );
};

export default Chat;
