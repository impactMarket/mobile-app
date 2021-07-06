import { storiesAction } from 'helpers/constants';
import {
    addStoriesToStateSuccess,
    addStoriesToStateFailure,
} from 'helpers/redux/actions/stories';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import Api from 'services/api';
import { takeLatest, call, put, all } from 'typed-redux-saga';

const getStories = (start: number, end: number) =>
    Api.story.list<ICommunitiesListStories[]>(start, end);

export function* submitAddStoriesToStateRequest({ payload }: any) {
    try {
        const { start, end } = payload;

        const stories: ICommunitiesListStories[] = yield call(
            getStories,
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
    takeLatest(storiesAction.INIT_REQUEST, submitAddStoriesToStateRequest),
]);