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
                stories: {
                    data: action.payload.data,
                    count: action.payload.count,
                },
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

        case storiesAction.MORE_SUCCESS:
            return {
                ...state,
                stories: {
                    data: [...state.stories.data, ...action.payload.data],
                    count:
                        state.stories.data.length + action.payload.data.length,
                },
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
