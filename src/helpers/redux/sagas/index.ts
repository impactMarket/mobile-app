import { all, spawn } from 'typed-redux-saga';

import * as communities from './communities';
import { startWatchingNetworkConnectivity } from './offline';

export default function* rootSagas(): Generator {
    return yield all([spawn(startWatchingNetworkConnectivity), communities]);
}
