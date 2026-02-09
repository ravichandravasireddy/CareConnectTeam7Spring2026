jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name, ...props }: { name: string }) =>
    require('react').createElement('Text', props, name),
}));

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return {
    LinearGradient: ({ children, ...props }: { children?: React.ReactNode }) =>
      require('react').createElement(View, props, children),
  };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: ({ children, ...props }: { children?: React.ReactNode }) =>
      require('react').createElement(View, props, children),
  };
});

jest.mock('@/hooks/use-color-scheme', () => ({
  useColorScheme: () => (global as any).__mockColorScheme ?? 'light',
}));
