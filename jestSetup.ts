import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    Reanimated.default.call = () => {};

    return Reanimated;
});

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.useFakeTimers();

jest.mock('axios');

jest.mock('@react-navigation/native');
jest.mock('react-native-safe-area-context');
jest.mock('@react-navigation/stack');
jest.mock('expo-constants');
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@react-navigation/native', () => {
    return {
        ...jest.requireActual('@react-navigation/native'),
        useFocusEffect: () => jest.fn(),
        useNavigation: () => ({
            navigate: jest.fn(),
            dispatch: jest.fn(),
        }),
    };
});
