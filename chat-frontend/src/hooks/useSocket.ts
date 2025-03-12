import { SocketContext } from "@/context/socketContext";
import { useContext } from "react";

/**
 * hook to get the socket from the socket context
 * @author Sriram Sundar
 *
 * @returns {Socket | null} The socket instance or null if not available
 */
export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};
