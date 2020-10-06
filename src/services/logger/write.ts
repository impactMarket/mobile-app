import * as FileSystem from 'expo-file-system';
import * as Sentry from 'sentry-expo';

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

export { writeLog };
