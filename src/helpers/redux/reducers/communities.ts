import { communitiesAction } from 'helpers/constants';
import { CommunitiesActionTypes } from 'helpers/types/redux';
import { ICommunitiesState } from 'helpers/types/state';

const INITIAL_STATE_COMMUNITIES: ICommunitiesState = {
    communities: [],
    community: null,
    refreshing: false,
    reachedEndList: false,
};

export const communitiesReducer = (
    state = INITIAL_STATE_COMMUNITIES,
    action: CommunitiesActionTypes
) => {
    switch (action.type) {
        case communitiesAction.INIT_SUCCESS:
            return {
                ...state,
                communities: [
                    ...state.communities,
                    ...action.payload.communities,
                ],
                refreshing: false,
                reachedEndList: action.payload.reachedEndList,
            };

        case communitiesAction.INIT_FAILURE:
            return {
                ...state,
                refreshing: false,
            };

        case communitiesAction.INIT_CLEAN:
            return {
                ...state,
                communities: [],
                refreshing: false,
            };

        case communitiesAction.FIND_BY_ID_SUCCESS:
            return {
                ...state,
                community: action.payload.community,
                refreshing: false,
            };

        case communitiesAction.FIND_BY_ID_FAILURE:
            return {
                ...state,
                refreshing: false,
            };

        case communitiesAction.FIND_BY_ID_CLEAN:
            return {
                ...state,
                community: null,
                refreshing: false,
            };

        case communitiesAction.CREATE_COMMUNITY_SUCCESS:
            return {
                ...state,
                community: action.payload.community,
                refreshing: false,
            };

        case communitiesAction.CREATE_COMMUNITY_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                refreshing: false,
            };

        case communitiesAction.UPLOAD_COMMUNITY_IMAGE_SUCCESS:
            return {
                ...state,
                uploadURL: action.payload.uploadURL,
                media: action.payload.media,
                refreshing: false,
            };

        case communitiesAction.UPLOAD_COMMUNITY_IMAGE_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                refreshing: false,
            };

        default:
            return state;
    }
};
