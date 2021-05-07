import { storiesAction } from 'helpers/constants';
import {
    ICommunitiesListStories,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { StoriesActionTypes } from 'helpers/types/redux';

export function addStoriesToState(
    stories: ICommunitiesListStories[]
): StoriesActionTypes {
    return {
        type: storiesAction.INIT,
        payload: stories,
    };
}

export function addMyStoriesToState(
    myStories: ICommunityStory[]
): StoriesActionTypes {
    return {
        type: storiesAction.USER_STORIES,
        payload: myStories,
    };
}
