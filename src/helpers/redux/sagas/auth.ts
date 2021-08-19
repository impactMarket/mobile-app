import { SET_USER_AUTH_REQUEST } from 'helpers/constants';
import {
    addUserAuthToStateSuccess,
    addUserAuthToStateFailure,
} from 'helpers/redux/actions/auth';
import { IUserAuth } from 'helpers/types/endpoints';
import Api from 'services/api';
import { AuthParams } from 'services/api/routes/user';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const getUser = async (authParams: AuthParams) =>
    await Api.user.auth(authParams);

export function* submitUserAuthenticationRequest(action: {
    payload: AuthParams;
    type: string;
}) {
    try {
        const user: IUserAuth = yield call(getUser, action.payload);
        yield put(addUserAuthToStateSuccess(user));
    } catch (err) {
        yield put(addUserAuthToStateFailure(err));
    }
}

export default all([
    takeEvery(SET_USER_AUTH_REQUEST, submitUserAuthenticationRequest),
]);
