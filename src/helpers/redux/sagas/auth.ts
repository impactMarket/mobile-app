import { SET_USER_AUTH_REQUEST } from 'helpers/constants';
import {
    addUserAuthToStateSuccess,
    addUserAuthToStateFailure,
} from 'helpers/redux/actions/auth';
import Api from 'services/api';
import { AuthParams } from 'services/api/routes/user';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const getUser = async (authParams: AuthParams) =>
    await Api.user.auth(authParams);

export function* submitUserAuthenticationRequest(action: {
    payload: AuthParams;
    type: string;
}) {
    const result = yield call(getUser, action.payload);
    if (result.error !== undefined) {
        yield put(addUserAuthToStateFailure(result.error));
    } else {
        yield put(addUserAuthToStateSuccess(result.data));
    }
}

export default all([
    takeEvery(SET_USER_AUTH_REQUEST, submitUserAuthenticationRequest),
]);
