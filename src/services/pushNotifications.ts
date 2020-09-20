import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';

export async function sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string
) {
    return Notifications.scheduleNotificationAsync({
        content: {
            title,
            body,
        },
        trigger: null,
    });
}

export async function registerForPushNotifications(): Promise<string> {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(
            Permissions.NOTIFICATIONS
        );
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(
                Permissions.NOTIFICATIONS
            );
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            return '';
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
        return '';
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F',
        });
    }

    return token;
}
