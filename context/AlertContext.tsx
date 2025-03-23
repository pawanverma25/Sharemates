import Alert from "@/components/ui/Alert";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { StyleSheet } from "react-native";

interface AlertContextType {
    showAlert: (
        title: string,
        message: string,
        onConfirm?: () => void,
        onCancel?: () => void
    ) => void;
    hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [alertData, setAlertData] = useState({
        title: "",
        message: "",
        onConfirm: () => {},
        onCancel: () => {},
    });

    const showAlert = (
        title: string,
        message: string,
        onConfirm?: () => void
    ) => {
        setAlertData({
            title,
            message,
            onConfirm: onConfirm || (() => {}),
            onCancel: () => {},
        });
        setVisible(true);
    };

    const hideAlert = () => setVisible(false);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <Alert
                visible={visible}
                title={alertData.title}
                message={alertData.message}
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => {
                            alertData.onCancel();
                            setVisible(false);
                        },
                    },
                    {
                        text: "Proceed",
                        onPress: () => {
                            alertData.onConfirm();
                            setVisible(false);
                        },
                    },
                ]}
            />
        </AlertContext.Provider>
    );
};

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used within an AlertProvider");
    }
    return context;
};
