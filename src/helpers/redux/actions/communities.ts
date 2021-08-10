import { communitiesAction } from 'helpers/constants';
import { CommunityAttributes } from 'helpers/types/models';
import { CommunitiesActionTypes } from 'helpers/types/redux';

export function fetchCommunitiesListRequest(query: {
    offset: number;
    limit: number;
    orderBy?: string;
    filter?: string;
    lat?: number;
    lng?: number;
}): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_REQUEST,
        payload: query,
    };
}
export function fetchCommunitiesListSuccess(
    communities: CommunityAttributes[]
): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_SUCCESS,
        payload: communities,
    };
}

export function fetchCommunitiesListFailure(): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_FAILURE,
    };
}
