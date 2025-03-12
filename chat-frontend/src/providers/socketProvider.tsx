import { BACKEND_URL } from "@/constants";
import { SocketContext } from "@/context/socketContext";
import {
    addChatMessage, selectSelectedModel,
} from "@/state/slices/chatSlice";
import {
    ChatMessage,
    RootState,
    SocketProviderProps,
    UserInfo,
} from "@/types";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import {selectUserInfo} from "@/state/slices/authSlice.ts";

/**
 * Socket provider that provides the socket to the application
 * @author Sriram Sundar
 *
 * @param {SocketProviderProps} param0
 * @param {SocketProviderProps} param0.children
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({
                                                                  children,
                                                              }: SocketProviderProps) => {
    const socket = useRef<Socket | null>(null);
    const userInfo = useSelector(selectUserInfo);
    const dispatch = useDispatch();
    const selectedModel = useSelector(selectSelectedModel);

    useEffect(() => {
        if (userInfo) {
            socket.current = io(BACKEND_URL, {
                withCredentials: true,
                query: {
                    userId: userInfo.id,
                },
            });
            socket.current.on("connect", () => {
                console.log("socket connected");
            });

            return () => {
                socket.current?.disconnect();
            };
        }
    }, [userInfo]);

    useEffect(() => {
        if (socket.current) {
            console.log("setting up receive-message listener");

            const receiveMessage = (message: ChatMessage) => {
                console.log("received message", message);
                if (true
                    // chatType !== undefined &&
                    // ((chatData as UserInformation)?.id ===
                    //     (message.sender as UserInformation)?.id ||
                    //     (chatData as UserInformation)?.id ===
                    //     (message.receiver as UserInformation)?.id ||
                    //     (chatData as Textbook)?._id === (message.sender as Textbook)._id ||
                    //     (chatData as Textbook)?._id === (message.receiver as Textbook)._id)
                ) {
                    console.log("adding message to chat");

                    dispatch(addChatMessage(message));
                }
            };

            socket.current.on("receive-message", receiveMessage);
            return () => {
                socket.current?.off("receive-message", receiveMessage);
            };
        }
    }, [selectedModel, dispatch]);

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
