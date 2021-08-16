import { SET_USER_AUTH_REQUEST } from 'helpers/constants';
import {
    addUserAuthToStateSuccess,
    addUserAuthToStateFailure,
} from 'helpers/redux/actions/auth';
import { IUserAuth } from 'helpers/types/endpoints';
import * as Sentry from 'sentry-expo';
import Api from 'services/api';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const getUser = async (
    userAddress: string,
    language: string,
    currency: string,
    phoneNumber: string,
    pushNotificationToken: string
) =>
    await Api.user.auth(
        userAddress,
        language,
        currency,
        phoneNumber,
        pushNotificationToken
    );

export function* submitUserAuthenticationRequest({ payload }: any) {
    try {
        const {
            userAddress,
            language,
            currency,
            phoneNumber,
            pushNotificationToken,
        } = payload;

        const user: IUserAuth = yield call(
            getUser,
            userAddress,
            language,
            currency,
            phoneNumber,
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
