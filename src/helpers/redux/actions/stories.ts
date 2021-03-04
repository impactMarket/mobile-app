import { storiesAction } from 'helpers/constants';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import { StoriesActionTypes } from 'helpers/types/redux';

export function addStoriesToState(
    stories: ICommunitiesListStories[]
): StoriesActionTypes {
    return {
        type: storiesAction.INIT,
        payload: stories,
    };
}
