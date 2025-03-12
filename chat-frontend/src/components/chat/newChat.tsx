import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {useDispatch, useSelector} from "react-redux";
import {aiModelDetails, AppDispatch} from "@/types";
import {useSearchModelsMutation} from "@/state/api/modelApi.ts";
import {selectUserModels, setSelectedModel} from "@/state/slices/chatSlice.ts";
// import {
//     setSelectedChatType,
//     setSelectedChatData,
// } from "@/state/slices/chatSlice";

/**
 * New chat component that allows user to searcha and select a new chat
 * @author Sriram Sundar
 */
const NewChat: React.FC = () => {
    const [newChatModal, setNewChatModal] = useState<boolean>(false);

    const [searchedModels, setSearchedModels] = useState<aiModelDetails[]>([]);
    const [triggerSearchModels] = useSearchModelsMutation();
    const dispatch: AppDispatch = useDispatch();

    const searchTextbooks = async (modelName: string) => {
        console.log("searching...");
        console.log(modelName);

        console.log(modelName.length);

        if (modelName.length > 0) {
            console.log("starting server process");

            const result = (await triggerSearchModels({
                searchTerm: modelName,
            }));
            console.log(result);

            if ("data" in result && result.data.aiModels) {
                setSearchedModels(result.data.aiModels);
            } else {
                setSearchedModels([]);
            }
        }
    };

    const selectNewModel = (model: aiModelDetails) => {
        setNewChatModal(false);
        //dispatch(setSelectedChatType("textbook" as ChatType));
        console.log(model);

        dispatch(setSelectedModel(model));
        //const models = useSelector(selectUserModels);

        //dispatch(setSelectedChatData(textbook));
        console.log(model);
        setSearchedModels([]);
        //setSearchedTextbooks([]);
    };
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus
                            className="text-neutral-400 font-light text-opacity-90 text-small hover:text-neutral-100 cursor-pointer transition-all duration-300 "
                            onClick={() => setNewChatModal(true)}
                        />
                    </TooltipTrigger>
                    <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
                        Please select the model you wish to talk to
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChatModal} onOpenChange={setNewChatModal}>
                <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col p-7">
                    <DialogHeader className="items-center">
                        <DialogTitle>Select your model</DialogTitle>
                        {/* <DialogDescription>请选择要聊天的教科书 </DialogDescription> */}
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search Models"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => void searchTextbooks(e.target.value)}
                        />
                    </div>
                    {searchedModels.length > 0 && (
                        <ScrollArea className="h-[250px]">
                            <div className="flex flex-col gap-5">
                                {searchedModels.map((model, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="flex gap-3 items-center cursor-pointer"
                                            onClick={() => void selectNewModel(model)}
                                        >
                                            <div className="flex flex-col">
                                                <span>{model ? `${model.name}` : ""}</span>
                                                <span className="text-xs">{model.description}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </ScrollArea>
                    )}
                    {searchedModels.length <= 0 && (
                        <div className="flex-1 md:flex mt-5 md:mt-0 flex-col justify-center items-center duration-1000 transition-all">
                            <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                                <h3 className="noto-serif-sc-normal">
                                    Hello<span className="text-purple-500">！</span>
                                    Search<span className="text-purple-500"> AI Models</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default NewChat;
