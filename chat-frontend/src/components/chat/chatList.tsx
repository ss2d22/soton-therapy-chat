import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectSelectedModel, selectUserModels,
    setSelectedModel, setUserModels,
} from "@/state/slices/chatSlice";
import { aiModelDetails, AppDispatch } from "@/types";
import { useEffectAsync } from "@/hooks/useEffectAsync.tsx";
import { useGetUserModelsMutation } from "@/state/api/modelApi.ts";
import { Skeleton } from "@/components/ui/skeleton"; // Add a loading skeleton

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
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <div className="w-full min-w-1 h-full p-4 bg-gray-900 rounded-lg">
            <h2 className="text-lg font-semibold text-white mb-3">AI Models</h2>

            {isLoading ? (
                <div className="space-y-3">
                    <Skeleton className="h-8 w-full bg-gray-700 rounded-md" />
                    <Skeleton className="h-8 w-full bg-gray-700 rounded-md" />
                    <Skeleton className="h-8 w-full bg-gray-700 rounded-md" />
                </div>
            ) : models.length > 0 ? (
                <div className="space-y-2">
                    {models.map((model) => (
                        <div
                            key={model._id}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-3
                            ${selectedModel?._id === model._id
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-800 text-neutral-300 hover:bg-gray-700 hover:text-white"}`}
                            onClick={() => handleClick(model)}
                        >
                            <span className="truncate">{model.name}</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-neutral-400 text-sm italic">No models available</div>
            )}

            {/* Append an element if the selectedModel is not in the models list */}
            {!isLoading && models && selectedModel && !models.some((m) => m._id === selectedModel._id) && (
                <div
                    key={selectedModel._id}
                    className="px-4 py-2 mt-2 rounded-lg bg-blue-500 text-white shadow-md cursor-pointer flex items-center gap-3"
                    onClick={() => handleClick(selectedModel)}
                >
                    <span className="truncate">{selectedModel.name}</span>
                </div>
            )}
        </div>
    );
};

export default ChatList;
