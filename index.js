import 'react-native-gesture-handler';
import 'expo/build/Expo.fx';
import registerRootComponent from 'expo/build/launch/registerRootComponent';
import { activateKeepAwake } from 'expo-keep-awake';

import App from './App';
import { enableScreens } from 'react-native-screens';

enableScreens();

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(App);
