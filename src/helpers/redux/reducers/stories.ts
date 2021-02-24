import { storiesAction } from 'helpers/constants';
import { StoriesActionTypes } from 'helpers/types/redux';
import { IStoriesState } from 'helpers/types/state';

const INITIAL_STATE_STORIES: IStoriesState = {
    stories: [],
};

export const storiesReducer = (
    state = INITIAL_STATE_STORIES,
    action: StoriesActionTypes
) => {
    switch (action.type) {
        case storiesAction.INIT:
            return {
                stories: action.payload,
            };

        case storiesAction.CONCAT:
            return {
                stories: state.stories.concat(action.payload),
            };

        default:
            return state;
    }
};
