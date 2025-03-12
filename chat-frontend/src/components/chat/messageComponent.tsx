import { ChatMessage } from "@/types";

interface MessageProps {
    msg: ChatMessage;
}

const MessageComponent: React.FC<MessageProps> = ({ msg }) => {
    return (
        <div className={`flex items-start space-x-2 ${msg.isAI ? "justify-start" : "justify-end"}`}>
            <p className="font-bold">{msg.isAI ? "AI: " : "You: "}</p>
            <p className="bg-gray-200 dark:bg-gray-700 p-2 rounded-md">{msg.message}</p>
            <p className="text-xs text-gray-500">{new Date(msg.timeStamp).toLocaleTimeString()}</p>
        </div>
    );
};

export default MessageComponent;
