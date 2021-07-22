import { storiesAction } from 'helpers/constants';
import {
    addStoriesToStateSuccess,
    addStoriesToStateFailure,
    addMoreStoriesToStateSuccess,
    addMoreStoriesToStateFailure,
} from 'helpers/redux/actions/stories';
import {
    ICommunitiesListStories,
    ICommunitiesListStoriesResponse,
} from 'helpers/types/endpoints';
import Api from 'services/api';
import { IApiResult } from 'services/api/base';
import { takeLatest, call, put, all } from 'typed-redux-saga';

const getStories = async (start: number, end: number) => {
    return await Api.story.list<ICommunitiesListStories[]>(start, end);
};

export function* submitAddStoriesToStateRequest({ payload }: any) {
    try {
        const { start, end } = payload;

        const stories: IApiResult<ICommunitiesListStories[]> = yield call(
            getStories,
            start,
            end
        );
        const { data, count } = stories;

        yield put(addStoriesToStateSuccess(data, count));
    } catch (err) {
        yield put(addStoriesToStateFailure());
    }
}

export function* submitAddMoretoriesToStateRequest({ payload }: any) {
    try {
        const { start, end } = payload;

        const stories: ICommunitiesListStoriesResponse = yield call(
            getStories,
            start,
            end
        );
        const { data } = stories;

        yield put(addMoreStoriesToStateSuccess(data));
    } catch (err) {
        yield put(addMoreStoriesToStateFailure());
    }
}

export default all([
    takeLatest(storiesAction.INIT_REQUEST, submitAddStoriesToStateRequest),
    takeLatest(storiesAction.MORE_REQUEST, submitAddMoretoriesToStateRequest),
]);
