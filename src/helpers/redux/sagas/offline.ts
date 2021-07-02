import NetInfo from '@react-native-community/netinfo';
import i18n from 'assets/i18n';
import { showMessage } from 'react-native-flash-message';
import { OFFLINE, ONLINE } from 'redux-offline-queue';
import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

export function* startWatchingNetworkConnectivity(): any {
    const channel = eventChannel((emitter) => {
        const unsubscribe = NetInfo.addEventListener(emitter);
        return () => unsubscribe();
    });

    try {
        for (;;) {
            const netStatus = yield take(channel);

            if (netStatus.isConnected) {
                yield put({ type: ONLINE });
                showMessage({
                    message: i18n.t('sagas.messages.yourNetworkisOnline'),
                    type: 'success',
                });
            } else {
                yield put({ type: OFFLINE });
                showMessage({
                    message: i18n.t('sagas.messages.yourNetworkisOffline'),
                    type: 'danger',
                    autoHide: !netStatus.isConnected,
                    duration: 500000,
                });
            }
        }
    } finally {
        channel.close();
    }
}
