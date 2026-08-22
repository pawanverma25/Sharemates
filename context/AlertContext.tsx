import Alert from "@/components/ui/Alert";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { Platform, ToastAndroid } from "react-native";

interface AlertContextType {
    showAlert: (
        title: string,
        message: string,
        onConfirm?: () => void,
        onCancel?: () => void
    ) => void;
    hideAlert: () => void;
    showToast: (message: string) => void;
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
        onConfirm?: () => void,
        onCancel?: () => void
    ) => {
        setAlertData({
            title,
            message,
            onConfirm: onConfirm || (() => {}),
            onCancel: onCancel || (() => {}),
        });
        setVisible(true);
    };
    const showToast = (message: string) => {
        if (Platform.OS === "android") {
            ToastAndroid.showWithGravity(
                message,
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM
            );
        } else {
            showAlert("Notification", message);
        }
    };

    const hideAlert = () => setVisible(false);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, showToast }}>
            {children}
            <Alert
                visible={visible}
                title={alertData.title}
                message={alertData.message}
                buttons={[
                    {
                        text: "Cancel",
                        style: "cancel" as const,
                        onPress: () => {
                            alertData.onCancel();
                            setVisible(false);
                        },
                    },
                    {
                        text: "Okay",
                        onPress: () => {
                            alertData.onConfirm();
                            setVisible(false);
                        },
                    },
                ].filter(
                    (btn) =>
                        btn.text !== "Cancel" ||
                        alertData.onCancel !== (() => {})
                )}
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
