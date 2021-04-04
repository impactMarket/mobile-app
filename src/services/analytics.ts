import * as Analytics from 'expo-firebase-analytics';
import * as Sentry from 'sentry-expo';

async function analytics(action: string, details: any): Promise<void> {
    try {
        await Analytics.logEvent(action, details);
    } catch (e) {
        Sentry.Native.captureException(e);
    }
}

export { analytics };
