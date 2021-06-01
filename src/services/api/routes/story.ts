// import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
// import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import {
    ICommunitiesListStories,
    ICommunityStories,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';

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

    static add(story: {
        communityId: number;
        message?: string;
        mediaId?: number;
    }): Promise<ICommunityStory> {
        return this.api.post<ICommunityStory>('/story', story);
    }

    static async list<T extends ICommunitiesListStories[]>(
        offset?: number,
        limit?: number
    ): Promise<{ data: T; count: number }> {
        const r = await this.api.get<T>(
            '/story/list?includeIPCT=true' +
                (offset !== undefined ? `&offset=${offset}` : '') +
                (limit !== undefined ? `&limit=${limit}` : '')
        );
        return {
            data: r.data,
            count: r.count!,
        };
    }

    static async getByCommunity(
        communityId: number,
        isUserLogged: boolean // TODO: this must change
    ): Promise<ICommunityStories> {
        return (
            await this.api.get<ICommunityStories>(
                '/story/community/' + communityId,
                isUserLogged
            )
        ).data;
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

    static async me(): Promise<ICommunityStories> {
        return (await this.api.get<ICommunityStories>('/story/me', true)).data;
    }
}

export default ApiRouteStory;
