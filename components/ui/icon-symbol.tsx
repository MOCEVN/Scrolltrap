import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps, useMemo } from 'react';
import { Platform, type OpaqueColorValue, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - See Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - See SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'magnifyingglass': 'search',
  'plus.circle.fill': 'add-circle',
  'person.fill': 'person',
  "bubble.left.and.bubble.right.fill" : "chat-bubble",
  "info" : "info"
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle | TextStyle>; // Allow both ViewStyle and TextStyle
  weight?: SymbolWeight;
}) {
  const isIOS = useMemo(() => Platform.OS === 'ios', []);

  return isIOS ? (
    <SymbolView
      name={name}
      size={size}
      tintColor={color}
      style={style as StyleProp<ViewStyle>} // Cast to ViewStyle for SymbolView
      weight={weight}
    />
  ) : (
    <MaterialIcons
      color={color}
      size={size}
      name={MAPPING[name]}
      style={style as StyleProp<TextStyle>} // Cast to TextStyle for MaterialIcons
    />
  );
}

// Export the IconSymbolName type for use in other files
export type { IconSymbolName };
