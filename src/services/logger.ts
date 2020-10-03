import * as FileSystem from 'expo-file-system';
import * as Analytics from 'expo-firebase-analytics';
import { CONSENT_ANALYTICS } from 'helpers/types';
import { AsyncStorage } from 'react-native';
import Api from './api';

const logsFileUri = FileSystem.documentDirectory + 'logsxyz.txt';

async function writeLog(content: {
    action: string;
    details: any;
}): Promise<void> {
    AsyncStorage.getItem(CONSENT_ANALYTICS).then((c) => {
        if (c === null || c === 'true') {
            Analytics.logEvent(content.action, content.details);
        }
    });
    Analytics.logEvent(content.action, content.details);
    let logs = '';
    if ((await FileSystem.getInfoAsync(logsFileUri)).exists) {
        logs = await FileSystem.readAsStringAsync(logsFileUri);
    }
    logs += `${new Date().toString()} ${JSON.stringify(content)}\n`;
    await FileSystem.writeAsStringAsync(logsFileUri, logs);
}

async function uploadLogs(): Promise<boolean> {
    const logsFromFile = await FileSystem.readAsStringAsync(logsFileUri);
    return await Api.uploadLogs(logsFromFile);
}

export { writeLog, uploadLogs };
