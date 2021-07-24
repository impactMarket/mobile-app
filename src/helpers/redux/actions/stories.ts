import { storiesAction } from 'helpers/constants';
import {
    ICommunitiesListStories,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { StoriesActionTypes } from 'helpers/types/redux';
import { markActionsOffline } from 'redux-offline-queue';

markActionsOffline(storiesAction, [
    addStoriesToStateRequest,
    addMyStoriesToStateRequest,
]);

export function addStoriesToStateRequest(
    start: number,
    end: number
): StoriesActionTypes {
    return {
        type: storiesAction.INIT_REQUEST,
        payload: { start, end },
    };
}

export function addStoriesToStateSuccess(
    stories: ICommunitiesListStories[]
): StoriesActionTypes {
    return {
        type: storiesAction.INIT_SUCCESS,
        payload: stories,
    };
}

export function addStoriesToStateFailure(): StoriesActionTypes {
    return {
        type: storiesAction.INIT_FAILURE,
    };
}

export function addMyStoriesToStateRequest(
    myStories: ICommunityStory[]
): StoriesActionTypes {
    return {
        type: storiesAction.USER_STORIES_REQUEST,
        payload: myStories,
    };
}

export function addMyStoriesToStateSuccess(
    myStories: ICommunityStory[]
): StoriesActionTypes {
    return {
        type: storiesAction.USER_STORIES_SUCCESS,
        payload: myStories,
    };
}

export function addMyStoriesToStateFailue(
    myStories: ICommunityStory[]
): StoriesActionTypes {
    return {
        type: storiesAction.USER_STORIES_FAILURE,
    };
}
