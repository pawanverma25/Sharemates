import { useTheme } from "@/context/ThemeContext";
import { Link, Stack, usePathname } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
    const { colors } = useTheme();
    const pathname = usePathname();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            backgroundColor: colors.background,
        },
        text: {
            fontSize: 20,
            fontWeight: 600,
            color: colors.text,
        },
        link: {
            marginTop: 15,
            paddingVertical: 15,
            color: colors.primary,
        },
    });
    return (
        <>
            <Stack.Screen options={{ title: "Oops!" }} />
            <View style={styles.container}>
                <Text style={styles.text}>
                    {pathname} This screen doesn't exist.
                </Text>
                <Link href="/" style={styles.link}>
                    <Text>Go to home screen!</Text>
                </Link>
            </View>
        </>
    );
}
