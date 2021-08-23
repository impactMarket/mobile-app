import { all, spawn } from 'redux-saga/effects';

import auth from './auth';
import communitiesSaga from './communities';
import communitySaga from './community';
import { startWatchingNetworkConnectivity } from './offline';
import stories from './stories';

export default function* rootSagas() {
    return yield all([
        spawn(startWatchingNetworkConnectivity),
        communitiesSaga,
        communitySaga,
        stories,
        auth,
    ]);
}
