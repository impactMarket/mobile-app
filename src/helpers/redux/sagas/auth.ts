import { SET_USER_AUTH_REQUEST } from 'helpers/constants';
import {
    addUserAuthToStateSuccess,
    addUserAuthToStateFailure,
} from 'helpers/redux/actions/auth';
import { IUserAuth } from 'helpers/types/endpoints';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { AuthParams } from 'services/api/routes/user';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const getUser = async (
    address: string,
    language: string,
    currency: string,
    phone: string,
    pushNotificationToken: string
) =>
    await Api.user.auth({
        address,
        language,
        currency,
        phone,
        pushNotificationToken,
    });

export function* submitUserAuthenticationRequest(action: {
    payload: AuthParams;
    type: string;
}) {
    try {
        const {
            address,
            language,
            currency,
            phone,
            pushNotificationToken,
        } = action.payload;

        const user: IUserAuth = yield call(
            getUser,
            address,
            language,
            currency,
            phone,
            pushNotificationToken
        );

        console.log('addUserAuthToStateSuccess');
        yield put(addUserAuthToStateSuccess(user));
    } catch (err) {
        Sentry.Native.captureMessage(
            JSON.stringify({ action: 'login', details: err }),
            Sentry.Native.Severity.Critical
        );
        console.error('addUserAuthToStateFailure', err);
        yield put(addUserAuthToStateFailure(err));
    }
}

export default all([
    takeEvery(SET_USER_AUTH_REQUEST, submitUserAuthenticationRequest),
]);
