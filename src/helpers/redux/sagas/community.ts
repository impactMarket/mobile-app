import { communitiesAction } from 'helpers/constants';
import {
    createCommunitySuccess,
    createCommunityFailure,
} from 'helpers/redux/actions/communities';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import Api from 'services/api';
import { call, put, all, takeEvery } from 'typed-redux-saga';

import {
    setCommunityMetadata,
    setUserIsCommunityManager,
} from '../actions/user';

const _createCommunity = async (
    communityDetails: CommunityCreationAttributes
) => await Api.community.create(communityDetails);

export function* createCommunity({ payload }: any) {
    try {
        const { communityDetails } = payload;

        const { data, error } = yield call(_createCommunity, communityDetails);

        yield put(createCommunitySuccess(data, error));
        yield put(setCommunityMetadata(data));
        yield put(setUserIsCommunityManager(true));
    } catch (error) {
        yield put(createCommunityFailure(error));
    }
}

export default all([
    takeEvery(communitiesAction.CREATE_COMMUNITY_REQUEST, createCommunity),
]);
