import { all, spawn } from 'typed-redux-saga';

import { startWatchingNetworkConnectivity } from './offline';
import stories from './stories';

export default function* rootSagas() {
    return yield all([stories]);
    // return yield all([spawn(startWatchingNetworkConnectivity), stories]);
}
