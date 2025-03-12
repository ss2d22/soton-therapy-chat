import { ChatMessage } from "@/types";
import MessageComponent from "@/components/chat/messageComponent";
import {useSelector} from "react-redux";
import {selectChatMessages} from "@/state/slices/chatSlice.ts";

interface MessageListProps {
    messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = () => {
    const messages = useSelector(selectChatMessages);
    return (
        <div className="w-full flex flex-col space-y-2 p-4">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.senderModel==="AIModel" ? "justify-start" : "justify-end"}`}
                >
                    <MessageComponent msg={msg} />
                </div>
            ))}
        </div>
    );
};

export default MessageList;
