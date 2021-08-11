import { communitiesAction } from 'helpers/constants';
import { CommunitiesActionTypes } from 'helpers/types/redux';
import { ICommunitiesState } from 'helpers/types/state';

const INITIAL_STATE_COMMUNITIES: ICommunitiesState = {
    communities: [],
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

        default:
            return state;
    }
};
