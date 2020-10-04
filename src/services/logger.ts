import * as FileSystem from 'expo-file-system';
import * as Sentry from 'sentry-expo';
import Api from './api';

const logsFileUri = FileSystem.documentDirectory + 'logsxyz.txt';

async function writeLog(content: {
    action: string;
    details: any;
}): Promise<void> {
    try {
        let logs = '';
        if ((await FileSystem.getInfoAsync(logsFileUri)).exists) {
            logs = await FileSystem.readAsStringAsync(logsFileUri);
        }
        logs += `${new Date().toString()} ${JSON.stringify(content)}\n`;
        await FileSystem.writeAsStringAsync(logsFileUri, logs);
    } catch(e) {
        Sentry.captureException(e);
    }
}

async function uploadLogs(): Promise<number> {
    if ((await FileSystem.getInfoAsync(logsFileUri)).exists) {
        return -1;
    }
    const logsFromFile = await FileSystem.readAsStringAsync(logsFileUri);
    return (await Api.uploadLogs(logsFromFile)) ? 0 : 1;
}

export { writeLog, uploadLogs };
