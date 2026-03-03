import React from 'react';
import { View, Image} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoProps {
  size?: number;
  useIcon?: boolean;
  color?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 64, useIcon = false, color = '#4F46E5' }) => {
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      {useIcon ? (
        <Ionicons name="medical" size={size * 0.8} color={color} />
      ) : (
        <Image
          source={require('../../../assets/images/logo.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

export default Logo;