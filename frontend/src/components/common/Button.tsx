import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', disabled = false }) => {
  // Ensure disabled is boolean
  const isDisabled = Boolean(disabled);

  const variants = {
    primary: "bg-indigo-600",
    secondary: "bg-emerald-500",
    danger: "bg-red-500",
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled} // boolean only
      className={`p-4 rounded-lg items-center justify-center m-2 shadow-sm ${variants[variant]} ${isDisabled ? "opacity-50" : ""}`}
    >
      <Text className="text-white font-bold text-base">{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
