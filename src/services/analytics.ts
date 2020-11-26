import * as Analytics from 'expo-firebase-analytics';
import { CONSENT_ANALYTICS } from 'helpers/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from 'sentry-expo';

async function analytics(action: string, details: any): Promise<void> {
    try {
        const c = await AsyncStorage.getItem(CONSENT_ANALYTICS);
        if (c === null || c === 'true') {
            await Analytics.logEvent(action, details);
        }
    } catch (e) {
        Sentry.captureException(e);
    }
}

export { analytics };
