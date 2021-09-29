import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    // The mock for `call` immediately calls the callback which is incorrect
    // So we override it with a no-op
    Reanimated.default.call = () => {};

    return Reanimated;
});

jest.useFakeTimers();

// jest.mock('axios');

// jest.mock('@react-navigation/native');
// jest.mock('react-native-safe-area-context');
// jest.mock('@react-navigation/stack');
// jest.mock('expo-constants');
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// const mockedNavigate = jest.fn();

jest.mock('@react-navigation/native', () => {
    return {
        ...(jest.requireActual('@react-navigation/native') as any),
        // we need the actual "useNavigation" in create community test
        // useNavigation: () => ({
        //     setOptions: mockedNavigate,
        // }),
    };
});

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

// // As of react-native@0.64.X file has moved
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-redux', () => ({
    ...(jest.requireActual('react-redux') as any),
    useSelector: jest.fn(),
    useDispatch: jest.fn(),
    batch: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    ...(jest.requireActual('expo-image-picker') as any),
    launchImageLibraryAsync: jest.fn(),
}));

jest.mock('expo-location', () => ({
    ...(jest.requireActual('expo-location') as any),
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
}));
