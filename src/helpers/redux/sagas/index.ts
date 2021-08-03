import { all, spawn } from 'typed-redux-saga';

import { startWatchingNetworkConnectivity } from './offline';

export default function* rootSagas(): any {
    return yield all([spawn(startWatchingNetworkConnectivity)]);
}
