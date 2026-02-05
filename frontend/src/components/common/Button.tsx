import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
}

/**
 * Reusable Button Component
 */
const Button: React.FC<ButtonProps> = ({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false 
}) => {
  const isDisabled = disabled || loading;
  
  const variants = {
    primary: 'bg-indigo-600',
    secondary: 'bg-emerald-500',
    danger: 'bg-red-500',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`p-4 rounded-lg items-center justify-center m-2 ${variants[variant]} ${
        isDisabled ? 'opacity-50' : ''
      }`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-bold text-base">{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;