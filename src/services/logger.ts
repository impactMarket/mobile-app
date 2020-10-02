import * as FileSystem from 'expo-file-system';
import * as Analytics from 'expo-firebase-analytics';
import { AsyncStorage } from 'react-native';
import Api from './api';

const logsFileUri = FileSystem.documentDirectory + 'logs.txt';

async function writeLog(content: {
    action: string;
    details: any;
}): Promise<void> {
    AsyncStorage.getItem('CONSENT_ANALYTICS').then((c) => {
        if (c === null || c === 'true') {
            Analytics.logEvent(content.action, content.details);
        }
    });
    Analytics.logEvent(content.action, content.details);
    let logs = await FileSystem.readAsStringAsync(logsFileUri);
    logs += `\n${new Date().toString()} ${JSON.stringify(content)}`;
    await FileSystem.writeAsStringAsync(logsFileUri, logs, {
        encoding: FileSystem.EncodingType.UTF8,
    });
}

async function uploadLogs(): Promise<boolean> {
    const logsFromFile = await FileSystem.readAsStringAsync(logsFileUri);
    return await Api.uploadLogs(logsFromFile);
}

export { writeLog, uploadLogs };
