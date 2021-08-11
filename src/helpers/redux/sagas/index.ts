import { all, spawn } from 'redux-saga/effects';

import * as communitiesSaga from './communities';
import { startWatchingNetworkConnectivity } from './offline';

export default function* rootSagas() {
    return yield all([
        spawn(startWatchingNetworkConnectivity),
        communitiesSaga,
    ]);
}
