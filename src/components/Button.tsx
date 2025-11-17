import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    button: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 50,
    },
    fullWidth: {
      width: '100%',
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.surfaceSecondary,
      borderWidth: 2,
      borderColor: colors.border,
    },
    success: {
      backgroundColor: colors.primary,
    },
    danger: {
      backgroundColor: colors.error,
    },
    disabled: {
      opacity: 0.5,
    },
    text: {
      fontSize: 16,
      fontWeight: '700',
    },
    primaryText: {
      color: '#FFFFFF',
    },
    secondaryText: {
      color: colors.textPrimary,
    },
    successText: {
      color: '#FFFFFF',
    },
    dangerText: {
      color: '#FFFFFF',
    },
  });

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, styles[`${variant}Text` as keyof typeof styles] as TextStyle, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};
