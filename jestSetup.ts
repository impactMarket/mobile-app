// import { asMock } from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import fetchMock from 'jest-fetch-mock';
import 'jest-date-mock';

import 'react-native-gesture-handler/jestSetup';

Enzyme.configure({ adapter: new Adapter() });

jest.mock('react-native-gesture-handler', () => {
    // eslint-disable-next-line global-require
    const View = require('react-native/Libraries/Components/View/View');
    return {
        Swipeable: View,
        DrawerLayout: View,
        State: {},
        ScrollView: View,
        Slider: View,
        Switch: View,
        TextInput: View,
        ToolbarAndroid: View,
        ViewPagerAndroid: View,
        DrawerLayoutAndroid: View,
        WebView: View,
        TouchableOpacity: View,
        TouchableWithoutFeedback: View,
        NativeViewGestureHandler: View,
        TapGestureHandler: View,
        FlingGestureHandler: View,
        ForceTouchGestureHandler: View,
        LongPressGestureHandler: View,
        PanGestureHandler: View,
        PinchGestureHandler: View,
        RotationGestureHandler: View,
        /* Buttons */
        RawButton: View,
        BaseButton: View,
        RectButton: View,
        BorderlessButton: View,
        /* Other */
        FlatList: View,
        gestureHandlerRootHOC: jest.fn(),
        Directions: {},
    };
});

global.fetch = fetchMock;

jest.mock('@react-native-community/netinfo', () => ({
    isConnected: {
        addEventListener: jest.fn(),
    },
    getConnectionInfo: jest.fn().mockReturnValue({ type: 'test' }),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    NetInfoStateType: {
        unknown: 'unknown',
        none: 'none',
        cellular: 'cellular',
        wifi: 'wifi',
        bluetooth: 'bluetooth',
        ethernet: 'ethernet',
        wimax: 'wimax',
        vpn: 'vpn',
        other: 'other',
    },
}));

jest.mock('@react-native-async-storage/async-storage', () => ({}));
jest.mock('react-native-reanimated', () =>
    require('react-native-reanimated/mock')
);

jest.mock('react-native-reanimated', () => {
    const Reanimated = require('react-native-reanimated/mock');

    Reanimated.default.call = () => {};

    return Reanimated;
});

jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

jest.useFakeTimers();

jest.mock('axios');

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: (f) => f(),
    useDispatch: jest.fn(),
}));

jest.mock('@react-navigation/core');
jest.mock('react-native-safe-area-context');
jest.mock('@react-navigation/stack');
jest.mock('expo-constants');

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: jest.fn(),
    useEffect: jest.fn(),
    useRef: jest.fn().mockReturnValue({ currend: {} }),
}));

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
