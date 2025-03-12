import {useDispatch, useSelector} from "react-redux";
import {
    selectChatMessages,
    selectSelectedModel,
    setSelectedChatMessages,
    setSelectedModel
} from "@/state/slices/chatSlice.ts";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import NewChat from "@/components/chat/newChat.tsx";
import ChatList from "@/components/chat/chatList.tsx";
import MessageList from "@/components/chat/messageList.tsx";
import {ScrollArea} from "@radix-ui/react-scroll-area";
import {useState} from "react";
import {usePostFetchMessagesMutation} from "@/state/api/messagesApi.ts";
import {useEffectAsync} from "@/hooks/useEffectAsync.tsx";
import {selectUserInfo, setUserInfo} from "@/state/slices/authSlice.ts";
import {AppDispatch} from "@/types";
import {useSocket} from "@/hooks/useSocket";

const MessageInput = () => {
    const [currentMessage, setCurrentMessage] = useState("");
    const socket = useSocket();
    const userInfo = useSelector(selectUserInfo);
    const model = useSelector(selectSelectedModel);

    const sendMessage = () => {
        if (!currentMessage.trim()) return;
        console.log("sending message");

        console.log("socket: " + socket);
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

    const handleSend = async () => {
        sendMessage();
    }

    return (
        model? (<div className="flex w-full items-center gap-2 p-4 border-t border-gray-200 bg-white dark:bg-gray-900">
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
            </div>) : (<div></div>)

    );
};

const ChatContainer: React.FC = () => {
    //const messages = useSelector(selectChatMessages);
    const messages = useSelector(selectChatMessages);
    const [fetchMessages] = usePostFetchMessagesMutation();
    const [isLoading, setLoading] = useState(true);
    const dispatch: AppDispatch = useDispatch();
    const model = useSelector(selectSelectedModel);

    useEffectAsync(async () => {
        const getMessages = async () => {
            setLoading(true);
            console.log("fetching message history...");
            console.log("selected model: " + JSON.stringify(model));
            try {
                const result = (await fetchMessages({
                    aiModelId : model?._id,
                    receiverModel : "AIModel"
                }));
                console.log({ result });
                if (result.data && result.data.messages) {
                    dispatch(setSelectedChatMessages(result.data.messages));
                } else {
                    dispatch(setSelectedChatMessages([]));
                }
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
        <div className="flex w-full h-screen flex-row bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-30 p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <NewChat />
                <ChatList />
            </div>

            {/* Chat Area */}
            {isLoading ? <div>Loading history...</div> :
                <div className="flex w-70 flex-col flex-1">
                <div className="w-full flex-1 overflow-y-auto p-4">
                    <ScrollArea>
                        <MessageList messages={messages} />
                    </ScrollArea>

                </div>
                <div className="w-full">
                    <MessageInput />
                </div>

            </div>}
        </div>
    );
};

export default ChatContainer;