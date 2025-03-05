import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: {
    text: string;
    style?: 'default' | 'cancel' | 'destructive';
    onPress: () => void;
  }[];
  onDismiss?: () => void;
}

export default function CustomAlert({
  visible,
  title,
  message,
  buttons,
  onDismiss,
}: CustomAlertProps) {
  const { colors } = useTheme();
  const [animation] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    if (visible) {
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(animation, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    alertContainer: {
      backgroundColor: colors.card,
      borderRadius: 14,
      width: '80%',
      maxWidth: 400,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    title: {
      fontFamily: 'Inter-Bold',
      fontSize: 18,
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: colors.secondaryText,
      marginBottom: 20,
      textAlign: 'center',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 10,
    },
    button: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    defaultButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.cardHighlight,
    },
    destructiveButton: {
      backgroundColor: colors.error,
    },
    buttonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
    },
    defaultButtonText: {
      color: '#fff',
    },
    cancelButtonText: {
      color: colors.text,
    },
    destructiveButtonText: {
      color: '#fff',
    },
  });

  const getButtonStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    switch (style) {
      case 'cancel':
        return styles.cancelButton;
      case 'destructive':
        return styles.destructiveButton;
      default:
        return styles.defaultButton;
    }
  };

  const getButtonTextStyle = (style?: 'default' | 'cancel' | 'destructive') => {
    switch (style) {
      case 'cancel':
        return styles.cancelButtonText;
      case 'destructive':
        return styles.destructiveButtonText;
      default:
        return styles.defaultButtonText;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.alertContainer,
            {
              transform: [
                {
                  scale: animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
              ],
              opacity: animation,
            },
          ]}
        >
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.button, getButtonStyle(button.style)]}
                onPress={button.onPress}
              >
                <Text style={[styles.buttonText, getButtonTextStyle(button.style)]}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}