import { useDispatch, useSelector } from "react-redux";
import {
    selectChatMessages,
    selectSelectedModel,
    setSelectedChatMessages,
    setSelectedModel
} from "@/state/slices/chatSlice.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import NewChat from "@/components/chat/newChat.tsx";
import ChatList from "@/components/chat/chatList.tsx";
import MessageList from "@/components/chat/messageList.tsx";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useState } from "react";
import { usePostFetchMessagesMutation } from "@/state/api/messagesApi.ts";
import { useEffectAsync } from "@/hooks/useEffectAsync.tsx";
import { selectUserInfo, setUserInfo } from "@/state/slices/authSlice.ts";
import { AppDispatch } from "@/types";
import { useSocket } from "@/hooks/useSocket";

const MessageInput = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const socket = useSocket();
    const userInfo = useSelector(selectUserInfo);
    const model = useSelector(selectSelectedModel);

    const sendMessage = () => {
        if (!currentMessage.trim()) return;
        console.log("sending message");

        socket?.emit("send-message", {
            sender: userInfo?.id,
            content: currentMessage,
            receiver: model?._id,
            receiverModel: "AIModel",
            isAI: false,
            messageType: "text",
        });
        setCurrentMessage("");
    };

    return (
        model ? (
            <div className="flex w-full items-center gap-2 p-4 border-t border-gray-200 bg-white dark:bg-gray-900">
                <Input
                    id="chatInput"
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Enter your message here..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <Button
                    onClick={sendMessage}
                    className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                    Send
                </Button>
            </div>
        ) : null
    );
};

const ChatContainer: React.FC = () => {
    const messages = useSelector(selectChatMessages);
    const [fetchMessages] = usePostFetchMessagesMutation();
    const [isLoading, setLoading] = useState(true);
    const dispatch: AppDispatch = useDispatch();
    const model = useSelector(selectSelectedModel);

    useEffectAsync(async () => {
        const getMessages = async () => {
            setLoading(true);
            console.log("fetching message history...");
            try {
                const result = await fetchMessages({
                    aiModelId: model?._id,
                    receiverModel: "AIModel",
                });
                console.log({ result });
                dispatch(setSelectedChatMessages(result.data?.messages || []));
            } catch (error) {
                console.error(error);
                dispatch(setSelectedModel([]));
            } finally {
                setLoading(false);
            }
        };
        await getMessages();
    }, [model]);

    return (
        <div className="flex h-screen min-w-1 w-full ">
            {/* Sidebar */}
            <div className="w-[30%]  h-[80%] p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <NewChat />
                <ChatList />
            </div>

            {/* Chat Area */}
            <div className="flex flex-col w-[70%] h-[80%]">
                {isLoading ? (
                    <div className="flex flex-1 min-w-1 items-center justify-center">Loading history...</div>
                ) : (
                    <>
                        <div className="flex-1 min-w-[900px] w-[30%] overflow-y-auto p-4">
                            <ScrollArea>
                                <MessageList messages={messages} />
                            </ScrollArea>
                        </div>
                        <MessageInput />
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatContainer;
