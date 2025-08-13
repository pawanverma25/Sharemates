import { registerForPushNotificationsAsync } from "@/util/registerForPushNotificationsAsync";
import * as Notifications from "expo-notifications";
import { RelativePathString, useRouter } from "expo-router";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { ToastAndroid } from "react-native";

interface NotificationContextType {
    expoPushToken: string | null;
    notification: Notifications.Notification | null;
    error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined
);

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error(
            "useNotification must be used within a NotificationProvider"
        );
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
    children,
}) => {
    const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
    const [notification, setNotification] =
        useState<Notifications.Notification | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const notificationListener = useRef<Notifications.EventSubscription>();
    const responseListener = useRef<Notifications.EventSubscription>();
    const router = useRouter();

    useEffect(() => {
        registerForPushNotificationsAsync().then(
            (token) => setExpoPushToken(token),
            (error) => setError(error)
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                console.log(
                    "🔔 Notification Received while app is running: ",
                    notification
                );
                setNotification(notification);
            });

        responseListener.current =
            Notifications.addNotificationResponseReceivedListener(
                (response) => {
                    console.log(
                        "🔔 Notification Response: user intercats w the notification",
                        JSON.stringify(response, null, 2),
                        JSON.stringify(
                            response.notification.request.content.data,
                            null,
                            2
                        )
                    );
                    router.push("(auth)/forgot-password" as RelativePathString);
                }
            );

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(
                    notificationListener.current
                );
            }
            if (responseListener.current) {
                Notifications.removeNotificationSubscription(
                    responseListener.current
                );
            }
        };
    }, []);

    useEffect(() => {
        if (error) ToastAndroid.show(error.message, 2000);
    }, [error]);

    return (
        <NotificationContext.Provider
            value={{ expoPushToken, notification, error }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
