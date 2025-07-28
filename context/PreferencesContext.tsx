import { storageService } from "@/services/storageService";
import { userService } from "@/services/userService";
import React, {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

type PreferencesType = {
    pushNotifications?: boolean;
    emailNotifications?: boolean;
    theme?: "light" | "dark" | "system";
};

interface PreferencesContextType {
    preferences: PreferencesType;
    setPreferences: Dispatch<SetStateAction<PreferencesType>>;
}

const PreferencesContext = createContext<PreferencesContextType>({
    preferences: {},
    setPreferences: () => {},
});

export function PreferencesContextProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [preferences, setPreferences] = useState({
        pushNotifications: true,
        emailNotifications: true,
        theme: "system",
    } as PreferencesType);

    useEffect(() => {
        storageService.getItemAsync("preferences").then((prefs) => {
            if (prefs) {
                setPreferences(JSON.parse(prefs));
            }
        });
    }, []);

    return (
        <PreferencesContext.Provider value={{ preferences, setPreferences }}>
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const context = useContext(PreferencesContext);
    if (context === undefined) {
        throw new Error(
            "usePreferences must be used within a PreferencesContextProvider"
        );
    }
    return context;
}
