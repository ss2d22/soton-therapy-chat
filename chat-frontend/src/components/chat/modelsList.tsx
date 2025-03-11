import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {Tooltip, TooltipTrigger, TooltipContent, TooltipProvider} from "@/components/ui/tooltip";
import { useGetModelsListQuery } from "@/state/api/modelApi.ts";
import { useEffectAsync } from "@/hooks/useEffectAsync.tsx";
import { setUserInfo } from "@/state/slices/authSlice.ts";
import {aiModelDetails} from "@/types";
import {useGetFetchUserInfoQuery} from "@/state/api/authApi.ts";

const ModelsList = () => {
    const [modelsList, setModelsList] = useState<aiModelDetails[]>([]);
    //const [fetchModelsList] = useGetModelsListQuery(); // Correctly destructuring
    const [loading, setLoading] = useState<boolean>(true);
    const { refetch } = useGetModelsListQuery({});

    useEffectAsync(async () => {
        const result = await refetch();
        console.log("models list: " + JSON.stringify(result));
        console.log(result);
        setModelsList(result.data.aiModels);
        setLoading(false);
        //setModelsList(result.aiModels);
        //setLoading(false);

    }, []); // Dependency array to avoid unnecessary re-runs

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Select Model</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {loading || loading ? (
                    <DropdownMenuItem disabled>Loading models...</DropdownMenuItem>
                ) : modelsList.length > 0 ? (
                    modelsList.map((model) => (

                        <DropdownMenuItem>
                            <p>{model.name}</p>
                            <p>{model.description}</p>
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No models available</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModelsList;
