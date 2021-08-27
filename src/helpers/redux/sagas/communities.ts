import { communitiesAction } from 'helpers/constants';
import {
    fetchCommunitiesListSuccess,
    fetchCommunitiesListFailure,
    findCommunityByIdSuccess,
    findCommunityByIdFailure,
} from 'helpers/redux/actions/communities';
import { CommunityAttributes } from 'helpers/types/models';
import Api from 'services/api';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const listCommunities = (query: {
    offset: number;
    limit: number;
    orderBy?: string;
    filter?: string;
    lat?: number;
    lng?: number;
}) => Api.community.list(query);

const findCommunityByIdApi = (id: number) => Api.community.findById(id);

export function* fetchCommunitiesList({ payload }: any) {
    try {
        const communities: CommunityAttributes[] = yield call(
            listCommunities,
            payload
        );

        let reachedEndList: boolean;

        if (communities.length < 5) {
            reachedEndList = true;
        } else {
            reachedEndList = false;
        }

        yield put(fetchCommunitiesListSuccess(communities, reachedEndList));
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
