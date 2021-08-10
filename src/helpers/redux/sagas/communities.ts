import { communitiesAction } from 'helpers/constants';
import {
    fetchCommunitiesListSuccess,
    fetchCommunitiesListFailure,
} from 'helpers/redux/actions/communities';
import { CommunityAttributes } from 'helpers/types/models';
import Api from 'services/api';
import { takeLatest, call, put, all } from 'typed-redux-saga';

const listCommunities = (query: {
    offset: number;
    limit: number;
    orderBy?: string;
    filter?: string;
    lat?: number;
    lng?: number;
}) => Api.community.list(query);

export function* fetchCommunitiesList({ payload }: any) {
    try {
        const { query } = payload;

        const communities: CommunityAttributes[] = yield call(
            listCommunities,
            query
        );

        console.log('called fetchCommunitiesList');
        console.log({ communities });

        yield put(fetchCommunitiesListSuccess(communities));
    } catch (err) {
        yield put(fetchCommunitiesListFailure());
    }
}

export default all([
    takeLatest(communitiesAction.INIT_REQUEST, fetchCommunitiesList),
]);
