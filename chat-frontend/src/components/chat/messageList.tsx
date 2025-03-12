import { ChatMessage } from "@/types";
import MessageComponent from "@/components/chat/messageComponent";

interface MessageListProps {
    messages: ChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div className="flex flex-col space-y-2 p-4">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.isAI ? "justify-start" : "justify-end"}`}
                >
                    <MessageComponent msg={msg} />
                </div>
            ))}
        </div>
    );
};

export default MessageList;
