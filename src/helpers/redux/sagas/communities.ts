import { communitiesAction } from 'helpers/constants';
import {
    fetchCommunitiesListSuccess,
    fetchCommunitiesListFailure,
    findCommunityByIdSuccess,
    findCommunityByIdFailure,
} from 'helpers/redux/actions/communities';
import { CommunityListRequestParams } from 'helpers/types/endpoints';
import { CommunityAttributes } from 'helpers/types/models';
import Api from 'services/api';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const listCommunities = (query: CommunityListRequestParams) =>
    Api.community.list(query);

const findCommunityByIdApi = (id: number) => Api.community.findById(id);

export function* fetchCommunitiesList({ payload }: any) {
    try {
        const communities = yield call(listCommunities, payload);
        const { data, count } = communities;
        yield put(fetchCommunitiesListSuccess(data, count, data.length < 5));
    } catch (err) {
        yield put(fetchCommunitiesListFailure());
    }
}

export function* findCommunityById({ payload }: any) {
    try {
        const { id } = payload;
        const community: CommunityAttributes = yield call(
            findCommunityByIdApi,
            id
        );

        yield put(findCommunityByIdSuccess(community));
    } catch (err) {
        yield put(findCommunityByIdFailure());
    }
}

export default all([
    takeEvery(communitiesAction.INIT_REQUEST, fetchCommunitiesList),
    takeEvery(communitiesAction.FIND_BY_ID_REQUEST, findCommunityById),
]);
