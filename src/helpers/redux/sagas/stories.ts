import { storiesAction } from 'helpers/constants';
import {
    addMyStoriesToStateSuccess,
    addMyStoriesToStateFailue,
    addStoriesToStateSuccess,
    addStoriesToStateFailure,
} from 'helpers/redux/actions/stories';
import {
    ICommunitiesListStories,
    ICommunityStories,
} from 'helpers/types/endpoints';
import Api from 'services/api';
import { IApiResult } from 'services/api/base';
import { takeLatest, call, put, all } from 'typed-redux-saga';

const apiGetMyStories = async () => await Api.story.me();
const apiListStories = async (offset: number, limit: number) =>
    await Api.story.list(offset, limit);

export function* getMyStories() {
    try {
        const stories: IApiResult<ICommunityStories> = yield call(
            apiGetMyStories
        );
        const { data } = stories;

        yield put(addMyStoriesToStateSuccess(data.stories));
    } catch (err) {
        yield put(addMyStoriesToStateFailue());
    }
}

export function* listStories({
    payload,
}: {
    payload: { start: number; end: number };
    type: string;
}) {
    try {
        const { start, end } = payload;

        const stories: IApiResult<ICommunitiesListStories[]> = yield call(
            apiListStories,
            start,
            end
        );
        const { data } = stories;

        yield put(addStoriesToStateSuccess(data));
    } catch (err) {
        yield put(addStoriesToStateFailure());
    }
}

export default all([
    takeLatest(storiesAction.USER_STORIES_REQUEST, getMyStories),
    takeLatest(storiesAction.INIT_REQUEST, listStories),
]);
