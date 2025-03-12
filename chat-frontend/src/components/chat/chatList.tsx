import React, {useState} from "react";
import {
    selectChatMessages, selectSelectedModel, selectUserModels,
    setSelectedChatMessages, setSelectedModel, setUserModels,
} from "@/state/slices/chatSlice";
import {
    aiModelDetails,
    AppDispatch,
    ChatMessage
} from "@/types";
import { useDispatch, useSelector } from "react-redux";
import {useEffectAsync} from "@/hooks/useEffectAsync.tsx";
import {useGetUserModelsMutation} from "@/state/api/modelApi.ts";
import {useSocket} from "@/hooks/useSocket.ts";

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
    //const model = useSelector(selectSelectedModel);
    const [fetchUserModels] = useGetUserModelsMutation({});
    const [isLoading, setLoading] = useState(true);

    const handleClick = (model: aiModelDetails) => {
        dispatch(setSelectedModel(model));
        //dispatch(setSelectedChatMessages([]));
    };

    useEffectAsync(async () => {
        const fetchModels = async () =>{
            const response = await fetchUserModels({});
            console.log("models list: ", JSON.stringify(response));
            dispatch(setUserModels(response.data.models));
            setLoading(false);
        }
        if (!models) {
            await fetchModels();
        }
    }, []);

    return (
        <div className="mt-5">
            {isLoading ? <div>Loading history...</div> : models.map((model) => (
                    <div
                        key={model.id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer`}
                        onClick={() => handleClick(model)}
                    >
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {/* <span>{`${textbook.title} by ${textbook.author}`}</span> */}
                            <span>{`${model.name}`}</span>
                        </div>
                    </div>
            ))}

        </div>
    );
};

export default ChatList;
