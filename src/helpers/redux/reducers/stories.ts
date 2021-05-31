import { storiesAction } from 'helpers/constants';
import { StoriesActionTypes } from 'helpers/types/redux';
import { IStoriesState } from 'helpers/types/state';

const INITIAL_STATE_STORIES: IStoriesState = {
    stories: [],
    myStories: [],
};

export const storiesReducer = (
    state = INITIAL_STATE_STORIES,
    action: StoriesActionTypes
) => {
    switch (action.type) {
        case storiesAction.INIT_REQUEST:
            return {
                ...state,
                stories: action.payload,
            };

        case storiesAction.CONCAT:
            return {
                ...state,
                stories: state.stories.concat(action.payload),
            };

        case storiesAction.USER_STORIES_REQUEST:
            return {
                ...state,
                myStories: action.payload,
            };

        default:
            return state;
    }
};
