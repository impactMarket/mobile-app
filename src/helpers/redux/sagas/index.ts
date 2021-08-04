import { all, spawn } from 'typed-redux-saga';

// import auth from './auth';
import { startWatchingNetworkConnectivity } from './offline';

export default function* rootSagas(): Generator {
    return yield all([spawn(startWatchingNetworkConnectivity)]);
    // return yield all([spawn(startWatchingNetworkConnectivity), auth]);
}
