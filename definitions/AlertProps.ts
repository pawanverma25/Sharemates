export interface AlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons: {
        text: string;
        style?: "default" | "cancel" | "destructive";
        onPress: () => void;
    }[];
    onDismiss?: () => void;
}
