import { communitiesAction } from 'helpers/constants';
import { CommunitiesActionTypes } from 'helpers/types/redux';
import { ICommunitiesState } from 'helpers/types/state';

const INITIAL_STATE_COMMUNITIES: ICommunitiesState = {
    communities: [],
    refreshing: false,
};

export const communitiesReducer = (
    state = INITIAL_STATE_COMMUNITIES,
    action: CommunitiesActionTypes
) => {
    switch (action.type) {
        case communitiesAction.INIT_SUCCESS:
            return {
                ...state,
                communities: action.payload,
                refreshing: false,
            };

        case communitiesAction.INIT_REQUEST:
            return {
                ...state,
                refreshing: true,
            };

        case communitiesAction.INIT_FAILURE:
            return {
                ...state,
                refreshing: false,
            };

        default:
            return state;
    }
};
