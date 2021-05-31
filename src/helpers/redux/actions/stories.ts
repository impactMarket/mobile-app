import { storiesAction } from 'helpers/constants';
import {
    ICommunitiesListStories,
    ICommunitiesListStoriesPagination,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { StoriesActionTypes } from 'helpers/types/redux';

export function addStoriesToStateRequest(
    stories: ICommunitiesListStories[]
    pagination: ICommunitiesListStoriesPagination
): StoriesActionTypes {
    return {
        type: storiesAction.INIT_REQUEST,
        payload: pagination,
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

export function addStoriesToStateFailure(
    stories: ICommunitiesListStories[]
): StoriesActionTypes {
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
