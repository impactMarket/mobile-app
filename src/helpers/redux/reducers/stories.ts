import { storiesAction } from 'helpers/constants';
import { StoriesActionTypes } from 'helpers/types/redux';
import { IStoriesState } from 'helpers/types/state';

const INITIAL_STATE_STORIES: IStoriesState = {
    stories: { data: [], count: 0 },
    myStories: [],
    refreshing: false,
};

export const storiesReducer = (
    state = INITIAL_STATE_STORIES,
    action: StoriesActionTypes
) => {
    switch (action.type) {
        case storiesAction.INIT_SUCCESS:
            return {
                ...state,
                stories: action.payload,
                refreshing: false,
            };

        case storiesAction.INIT_REQUEST:
            return {
                ...state,
                refreshing: true,
            };

        case storiesAction.INIT_FAILURE:
            return {
                ...state,
                refreshing: false,
            };

        case storiesAction.MORE_REQUEST:
            return {
                ...state,
                refreshing: true,
            };

        case storiesAction.MORE_FAILURE:
            return {
                ...state,
                refreshing: false,
            };

        case storiesAction.MORE_SUCCESS:
            return {
                ...state,
                //TODO: add concat for this data
                stories: action.payload,
                refreshing: false,
            };

        case storiesAction.USER_STORIES_SUCCESS:
            return {
                ...state,
                myStories: action.payload,
            };

        case storiesAction.USER_STORIES_FAILURE:
            return {
                ...state,
            };

        default:
            return state;
    }
};
