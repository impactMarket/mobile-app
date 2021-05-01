// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import {
    ICommunitiesListStories,
    ICommunityStories,
} from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import { StoryContent } from 'helpers/types/story/storyContent';

import config from '../../../../config';
import {
    // getRequest,
    // postRequest,
    // deleteRequest,
    // putRequest,
    ApiRequests,
} from '../base';
// import * as Sentry from 'sentry-expo';

axios.defaults.baseURL = config.baseApiUrl;

class ApiRouteStory {
    static api = new ApiRequests();

    static async addPicture(mediaURI: string): Promise<AppMediaContent> {
        return this.api.uploadSingleImage('/story/picture', mediaURI);
    }

    static add(
        communityId: number,
        message?: string,
        mediaId?: number
    ): Promise<StoryContent> {
        return this.api.post<StoryContent>('/story', {
            communityId,
            message,
            mediaId,
        });
    }

    static async list<T extends ICommunitiesListStories[]>(): Promise<T> {
        return this.api.get<T>('/story/list');
    }

    static async getByCommunity(
        communityId: number,
        isUserLogged: boolean // TODO: this must change
    ): Promise<ICommunityStories> {
        return this.api.get<ICommunityStories>(
            '/story/community/' + communityId,
            isUserLogged
        );
    }

    static async love(storyId: number): Promise<void> {
        return this.api.put('/story/love/' + storyId, {});
    }

    static async inapropriate(storyId: number): Promise<void> {
        return this.api.put('/story/inapropriate/' + storyId, {});
    }

    static async remove(storyId: number): Promise<void> {
        return this.api.delete('/story/' + storyId, {});
    }

    static async me<T extends ICommunitiesListStories[]>(): Promise<T> {
        return this.api.get<T>('/story/me', true);
    }
}

export default ApiRouteStory;
