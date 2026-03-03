import { Platform } from 'react-native';

export const PLATFORM = {
  ISWEB: Platform.OS === 'web',
  ISNATIVE: Platform.OS !== 'web',
  ISIOS: Platform.OS === 'ios',
  ISANDROID: Platform.OS === 'android'
};

export const platformSelect = <T>(options: {
  web?: T;
  native?: T;
  ios?: T;
  android?: T;
  default?: T;
}): T | undefined => {
  if (PLATFORM.ISWEB && options.web !== undefined) return options.web;
  if (PLATFORM.ISIOS && options.ios !== undefined) return options.ios;
  if (PLATFORM.ISANDROID && options.android !== undefined) return options.android;
  if (PLATFORM.ISNATIVE && options.native !== undefined) return options.native;
  return options.default;
};