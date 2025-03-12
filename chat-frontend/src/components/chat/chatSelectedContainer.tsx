import { books } from "@/assets";
import Title from "@/components/Title";
import ProfileInfo from "@/components/chat/ProfileInfo";
import NewChat from "../NewChat";
import { useEffectAsync } from "@/hooks/useEffectAsync";
import { useGetGetTextbooksForListQuery } from "@/state/api/textbookApi";
import { AppDispatch, ChatMessaget } from "@/types";
import { useDispatch, useSelector } from "react-redux";
import { selectChatMessages, setSelectedChatMessages } from "@/state/slices/chatSlice";
import TextbookList from "@/components/TextbookList";
import {useGetModelsListQuery} from "@/state/api/modelApi.ts";

/**
 * chat selection side bar component
 * @author Sriram Sundar
 *
 */
const ChatSelectedContainer: React.FC = () => {
    const { refetch } = useGetUserModelsListQuery({});
    const dispatch: AppDispatch = useDispatch();
    const textbooks = useSelector(selectTextbooks);

    useEffectAsync(async () => {
        const result = await refetch();
        if (result.data && (result.data as { textbooks?: Textbook[] }).textbooks) {
            dispatch(
                setTextbooks((result.data as { textbooks: Textbook[] }).textbooks)
            );
        }
    }, []);
    return (
        <section className="relative md:w-[35vw] lg:[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full">
            {/* TODO: second time using the same thing need to refactor to component */}
            <div className="pt-3 flex items-center justify-center">
                <h1 className="text-5xl font-bold md:text-4xl">LiMedAi</h1>
                <img src={books} alt="books icon" className="w-[80px]" />
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Chat History by AI models" />
                    <NewChat />
                </div>
                <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                    <ModelsList models={models} />
                </div>
            </div>
            <ProfileInfo />
        </section>
    );
};

export default ChatSelectedContainer;
