import { storiesAction } from 'helpers/constants';
import {
    addStoriesToStateSuccess,
    addStoriesToStateFailure,
} from 'helpers/redux/actions/stories';
import { ICommunitiesListStories } from 'helpers/types/endpoints';
import Api from 'services/api';
import { takeLatest, call, put, all } from 'typed-redux-saga';

const getStories = () => Api.story.list<ICommunitiesListStories[]>();

export function* submitAddStoriesToStateRequest() {
    try {
        const stories: ICommunitiesListStories[] = yield call(getStories);

        const { data } = stories;

        yield put(addStoriesToStateSuccess(data));
    } catch (err) {
        yield put(addStoriesToStateFailure());
    }
}

export default all([
    takeLatest(storiesAction.INIT_REQUEST, submitAddStoriesToStateRequest),
]);
