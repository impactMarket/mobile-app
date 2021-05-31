import NetInfo from '@react-native-community/netinfo';
import { OFFLINE, ONLINE } from 'redux-offline-queue';
import { eventChannel } from 'redux-saga';
import { put, take } from 'redux-saga/effects';

export function* startWatchingNetworkConnectivity() {
    // const netInfoSubscribe = NetInfo.addEventListener((state) => {
    //     const offline = !(state.isConnected && state.isInternetReachable);
    //     if (offline) {
    //         showMessage({
    //             message: i18n.t('networkConnectionLost'),
    //             type: 'info',
    //             autoHide: !offline,
    //         });
    //     }
    // });

    const channel = eventChannel((emitter) => {
        const unsubscribe = NetInfo.addEventListener(emitter);
        console.log('startWatchingNetworkConnectivity');
        return () => unsubscribe();
    });

    try {
        for (;;) {
            const isConnected = yield take(channel);

            if (isConnected) {
                yield put({ type: ONLINE });
            } else {
                yield put({ type: OFFLINE });
            }
        }
    } finally {
        channel.close();
    }
}
