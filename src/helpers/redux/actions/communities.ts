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
    communities: CommunityAttributes[],
    reachedEndList: boolean
): CommunitiesActionTypes {
    return {
        type: communitiesAction.INIT_SUCCESS,
        payload: { communities, reachedEndList },
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
