import * as FileSystem from 'expo-file-system';
import Api from '../api';

const logsFileUri = FileSystem.documentDirectory + 'logsxyz.txt';

async function uploadLogs(): Promise<number> {
    if ((await FileSystem.getInfoAsync(logsFileUri)).exists) {
        return -1;
    }
    const logsFromFile = await FileSystem.readAsStringAsync(logsFileUri);
    return (await Api.uploadLogs(logsFromFile)) ? 0 : 1;
}

export { uploadLogs };
