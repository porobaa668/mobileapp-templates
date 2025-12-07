import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { Colors } from '@/constants/Colors';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'default' | 'lg';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'default',
  size = 'default',
  loading = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const buttonStyle = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    disabled && styles.disabled,
    style,
  ];

  const textStyle = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'default' ? '#fff' : Colors.light.tint}
          size="small"
        />
      ) : (
        <Text style={textStyle}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  default: {
    backgroundColor: Colors.light.tint,
  },
  secondary: {
    backgroundColor: '#f1f5f9',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  destructive: {
    backgroundColor: '#ef4444',
  },
  disabled: {
    opacity: 0.5,
  },
  size_sm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  size_default: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  size_lg: {
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  text: {
    fontWeight: '600',
  },
  text_default: {
    color: '#ffffff',
  },
  text_secondary: {
    color: '#1e293b',
  },
  text_outline: {
    color: '#1e293b',
  },
  text_ghost: {
    color: Colors.light.tint,
  },
  text_destructive: {
    color: '#ffffff',
  },
  textSize_sm: {
    fontSize: 13,
  },
  textSize_default: {
    fontSize: 14,
  },
  textSize_lg: {
    fontSize: 16,
  },
});
