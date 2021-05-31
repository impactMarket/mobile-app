import { all } from 'typed-redux-saga';

import stories from './stories';

export default function* rootSagas() {
    return yield all([stories]);
}
