import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useGetModelsListQuery } from "@/state/api/modelApi.ts";
import { useEffectAsync } from "@/hooks/useEffectAsync.tsx";
import { setUserInfo } from "@/state/slices/authSlice.ts";
import {aiModelDetails} from "@/types";

const ModelsList = () => {
    const [modelsList, setModelsList] = useState<aiModelDetails[]>([]);
    const { data: fetchedModels, isLoading } = useGetModelsListQuery(); // Correctly destructuring
    const [loading, setLoading] = useState<boolean>(true);

    useEffectAsync(async () => {
        if (fetchedModels && fetchedModels.aiModels) {
            setModelsList(fetchedModels.aiModels);
            setLoading(false);
        }
    }, [fetchedModels]); // Dependency array to avoid unnecessary re-runs

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Model</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {isLoading || loading ? (
                    <DropdownMenuItem disabled>Loading models...</DropdownMenuItem>
                ) : modelsList.length > 0 ? (
                    modelsList.map((model) => (
                        <Tooltip key={model.id}>
                            <TooltipTrigger asChild>
                                <DropdownMenuItem>{model.name}</DropdownMenuItem>
                            </TooltipTrigger>
                            <TooltipContent>{model.description}</TooltipContent>
                        </Tooltip>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No models available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModelsList;
