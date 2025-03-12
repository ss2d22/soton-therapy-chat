import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectSelectedModel, selectUserModels,
    setSelectedModel, setUserModels,
} from "@/state/slices/chatSlice";
import { aiModelDetails, AppDispatch } from "@/types";
import { useEffectAsync } from "@/hooks/useEffectAsync.tsx";
import { useGetUserModelsMutation } from "@/state/api/modelApi.ts";

/**
 * ChatList component for the sidebar
 */
const ChatList: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const models = useSelector(selectUserModels);
    const selectedModel = useSelector(selectSelectedModel);
    const [fetchUserModels] = useGetUserModelsMutation();
    const [isLoading, setLoading] = useState(true);

    const handleClick = (model: aiModelDetails) => {
        dispatch(setSelectedModel(model));
    };

    useEffectAsync(async () => {
        if (!models || models.length === 0) {
            const response = await fetchUserModels({});
            console.log("Models list: ", JSON.stringify(response));
            if (response.data?.models) {
                dispatch(setUserModels(response.data.models));
            }
            setLoading(false);
        }
        setLoading(false);
    }, []);

    return (
        <div className="mt-5">
            {isLoading ? (
                <div>Loading history...</div>
            ) : (
                models.map((model) => (
                    <div
                        key={model._id}
                        className={`pl-10 py-2 transition-all duration-300 cursor-pointer 
                        ${selectedModel?._id === model._id ? "bg-gray-700 text-white" : "text-neutral-300"}`}
                        onClick={() => handleClick(model)}
                    >
                        <div className="flex gap-5 items-center justify-start">
                            <span>{model.name}</span>
                        </div>
                    </div>
                ))
            )}

            {/* Append an element if the selectedModel is not in the models list */}
            {!isLoading && models && !models.some((m) => m._id === selectedModel?._id) && selectedModel && (
                <div
                    key={selectedModel._id}
                    className="pl-10 py-2 bg-blue-500 text-white cursor-pointer"
                    onClick={() => handleClick(selectedModel)}
                >
                    <div className="flex gap-5 items-center justify-start">
                        <span>{selectedModel.name}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatList;
