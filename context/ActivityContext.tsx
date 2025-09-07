import LoadingOverlay from "@/components/ui/LoadingOverlay";
import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";

interface ActivityContextType {
    isRefreshing: boolean;
    setIsRefreshing: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const ActivityContext = createContext<ActivityContextType | undefined>(
    undefined
);

export const ActivityContextProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <ActivityContext.Provider
            value={{ isRefreshing, setIsRefreshing, isLoading, setIsLoading }}
        >
            {children}
            <LoadingOverlay visible={isLoading} />
        </ActivityContext.Provider>
    );
};

export const useActivity = () => {
    const context = useContext(ActivityContext);
    if (!context) {
        throw new Error(
            "useActivity must be used within an ActivityContextProvider"
        );
    }
    return context;
};
