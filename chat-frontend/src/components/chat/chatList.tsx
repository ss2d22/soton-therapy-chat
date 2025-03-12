import React from "react";
import {
    selectChatMessages, selectUserModels,
    setSelectedChatMessages,
} from "@/state/slices/chatSlice";
import {
    aiModelDetails,
    AppDispatch,
    ChatMessage
} from "@/types";
import { useDispatch, useSelector } from "react-redux";

/**
 * Textbook list component for the sidebar
 * @author Sriram Sundar
 *
 * @param {{ textbooks: any; }} param0
 * @param {*} param0.textbooks
 */
const ChatList: React.FC = () => {
    //const selectedChatData = useSelector(selectCurrentChat);
    const dispatch: AppDispatch = useDispatch();
    const models = useSelector(selectUserModels);


    const handleClick = (model: aiModelDetails) => {
        dispatch(setSelectedChatMessages([]));
    };

    return (
        <div className="mt-5">
            {models ? models.map((model) => (
                    <div
                        key={model._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer`}
                        onClick={() => handleClick(model)}
                    >
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {/* <span>{`${textbook.title} by ${textbook.author}`}</span> */}
                            <span>{`${model.name}`}</span>
                        </div>
                    </div>
            )) : <div></div>}

        </div>
    );
};

export default ChatList;
