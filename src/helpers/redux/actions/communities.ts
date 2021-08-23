import { communitiesAction } from 'helpers/constants';
import { AppMediaContent, CommunityAttributes } from 'helpers/types/models';
import { CommunitiesActionTypes } from 'helpers/types/redux';
import error from 'views/community/details/donate/modals/error';

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

export function createCommunitySuccess(
    community: CommunityAttributes
): CommunitiesActionTypes {
    return {
        type: communitiesAction.CREATE_COMMUNITY_SUCCESS,
        payload: { community },
    };
}

export function createCommunityFailure(error: any): CommunitiesActionTypes {
    return {
        type: communitiesAction.CREATE_COMMUNITY_FAILURE,
        payload: { error },
    };
}

export function uploadCoverImageSuccess(
    uploadURL: string,
    media: AppMediaContent
): CommunitiesActionTypes {
    return {
        type: communitiesAction.UPLOAD_COMMUNITY_IMAGE_SUCCESS,
        payload: { uploadURL, media },
    };
}

export function uploadCoverImageFailure(error: any): CommunitiesActionTypes {
    return {
        type: communitiesAction.UPLOAD_COMMUNITY_IMAGE_FAILURE,
        payload: { error },
    };
}
