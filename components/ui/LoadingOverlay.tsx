import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const { width, height } = Dimensions.get("window");

export default function LoadingOverlay({ visible }: { visible: boolean }) {
    const { colors, theme } = useTheme();

    if (!visible) return null;

    const styles = StyleSheet.create({
        overlay: {
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            backgroundColor:
                theme === "dark" ? "rgba(0,0,0,0.5)" : "rgba(256,256,256,0.5)", // semi-transparent
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000, // ensures it’s on top
        },
    });
    return (
        <View style={styles.overlay}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    );
}
