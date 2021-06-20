import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.useFakeTimers();

jest.mock('axios');

jest.mock('@react-navigation/native');
jest.mock('react-native-safe-area-context');
jest.mock('@react-navigation/stack');
jest.mock('expo-constants');
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => jest.fn(),
    useNavigationParam: jest.fn(
        jest.requireActual('@react-navigation/native').useNavigationParam
    ),
}));
