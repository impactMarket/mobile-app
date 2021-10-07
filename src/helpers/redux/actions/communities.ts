import { communitiesAction } from 'helpers/constants';
import { CommunityListRequestParams } from 'helpers/types/endpoints';
import { CommunityAttributes } from 'helpers/types/models';
import { CommunitiesActionTypes } from 'helpers/types/redux';

export function fetchCommunitiesListRequest(
    query: CommunityListRequestParams
): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_REQUEST,
        payload: query,
    };
}
export function fetchCommunitiesListSuccess(
    communities: CommunityAttributes[],
    count: number,
    reachedEndList: boolean
): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_SUCCESS,
        payload: { communities, count, reachedEndList },
    };
}

export function fetchCommunitiesListFailure(): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_FAILURE,
    };
}

export function cleanCommunitiesListState(): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_CLEAN,
    };
}

export function findCommunityByIdRequest(id: number): CommunitiesActionTypes {
    return {
        type: communitiesAction.FIND_BY_ID_REQUEST,
        payload: { id },
    };
}

export function cleanCommunityState(): CommunitiesActionTypes {
    return {
        type: communitiesAction.FIND_BY_ID_CLEAN,
    };
}
export function findCommunityByIdSuccess(
    community: CommunityAttributes
): CommunitiesActionTypes {
    return {
        type: communitiesAction.FIND_BY_ID_SUCCESS,
        payload: { community },
    };
}

export function findCommunityByIdFailure(): CommunitiesActionTypes {
    return {
        type: communitiesAction.FIND_BY_ID_FAILURE,
    };
}

export function findCommunityByIdClear(): CommunitiesActionTypes {
    return {
        type: communitiesAction.FIND_BY_ID_CLEAN,
    };
}
