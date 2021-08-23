import { communitiesAction } from 'helpers/constants';
import {
    createCommunitySuccess,
    createCommunityFailure,
    uploadCoverImageFailure,
    uploadCoverImageSuccess,
} from 'helpers/redux/actions/communities';
import { CommunityCreationAttributes } from 'helpers/types/endpoints';
import Api from 'services/api';
import { call, put, all, takeEvery } from 'typed-redux-saga';

const _createCommunity = async (
    communityDetails: CommunityCreationAttributes
) => await Api.community.create(communityDetails);

const _uploadCover = async (coverImage: string) =>
    await Api.community.uploadCover(coverImage);

export function* createCommunity({ payload }: any) {
    try {
        const { communityDetails } = payload;

        const community = yield call(_createCommunity, communityDetails);

        yield put(createCommunitySuccess(community.data));
    } catch (err) {
        yield put(createCommunityFailure(err));
    }
}

export function* uploadCoverImageCommunity({ payload }: any) {
    try {
        const { coverImage } = payload;

        const { uploadURL, media } = yield call(_uploadCover, coverImage);

        yield put(uploadCoverImageSuccess(uploadURL, media));
    } catch (err) {
        yield put(uploadCoverImageFailure(err));
    }
}

export default all([
    takeEvery(communitiesAction.CREATE_COMMUNITY_REQUEST, createCommunity),
    takeEvery(
        communitiesAction.UPLOAD_COMMUNITY_IMAGE_REQUEST,
        uploadCoverImageCommunity
    ),
]);
