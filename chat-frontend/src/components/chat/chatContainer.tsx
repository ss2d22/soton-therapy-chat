import {useSelector} from "react-redux";
import {selectChatMessages} from "@/state/slices/chatSlice.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import NewChat from "@/components/chat/newChat.tsx";
import ChatList from "@/components/chat/chatList.tsx";
import MessageList from "@/components/chat/messageList.tsx";
import {ScrollArea} from "@radix-ui/react-scroll-area";
import {useState} from "react";

const MessageInput = () => {
    const [currentMessage, setCurrentMessage] = useState("");

    const handleSend = async () => {
        setCurrentMessage("");
    }

    return (
        <div className="flex w-full items-center gap-2 p-4 border-t border-gray-200 bg-white dark:bg-gray-900">
            <Input
                id="chatInput"
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Enter your message here..."
                className=""
            />
            <Button onClick={handleSend} className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600">
                Send
            </Button>
        </div>
    );
};

const ChatContainer: React.FC = () => {
    const messages = useSelector(selectChatMessages);

    return (
        <div className="flex w-full h-screen flex-row bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-30 p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <NewChat />
                <ChatList />
            </div>

            {/* Chat Area */}
            <div className="flex w-70 flex-col flex-1">
                <div className="w-full flex-1 overflow-y-auto p-4">
                    <ScrollArea>
                        <MessageList messages={messages} />
                    </ScrollArea>

                </div>
                <div className="w-full">
                    <MessageInput />
                </div>

            </div>
        </div>
    );
};

export default ChatContainer;