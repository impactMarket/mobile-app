import axios from 'axios';
import {
    ICommunitiesListStories,
    ICommunityStories,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import path from 'path';
import * as mime from 'react-native-mime-types';

import config from '../../../../config';
import { ApiRequests, IApiResult } from '../base';

axios.defaults.baseURL = config.baseApiUrl;

class ApiRouteStory {
    static api = new ApiRequests();

    static async preSignedUrl(
        uri: string
    ): Promise<{ uploadURL: string; media: AppMediaContent }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await this.api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/story/media/' + mimetype,
                true
            )
        ).data;
        return preSigned;
    }

    static async uploadImage(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ) {
        const resp = await fetch(uri);
        const imageBody = await resp.blob();

        const result = await fetch(preSigned.uploadURL, {
            method: 'PUT',
            body: imageBody,
        });
        if (result.status >= 400) {
            throw new Error('not uploaded');
        }
        // wait until image exists on real endpoint
        // TODO: improve this
        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
        let tries = 30;
        while (tries-- > 0) {
            await delay(1000);
            const { status } = await this.api.head(preSigned.media.url);
            if (status === 200) {
                return true;
            }
        }
        return false;
    }

    static async add(story: {
        communityId: number;
        message?: string;
        mediaId?: number;
    }): Promise<IApiResult<ICommunityStory>> {
        return this.api.post<ICommunityStory>('/story', story);
    }

    static async list<T extends ICommunitiesListStories[]>(
        offset?: number,
        limit?: number
    ): Promise<IApiResult<T>> {
        return this.api.get<T>(
            '/story/list?includeIPCT=true' +
                (offset !== undefined ? `&offset=${offset}` : '') +
                (limit !== undefined ? `&limit=${limit}` : '')
        );
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

    static async love(storyId: number): Promise<IApiResult<any>> {
        return this.api.put('/story/love/' + storyId, {});
    }

    static async inapropriate(storyId: number): Promise<IApiResult<any>> {
        return this.api.put('/story/inapropriate/' + storyId, {});
    }

    static async remove(storyId: number): Promise<IApiResult<void>> {
        return this.api.delete<void>('/story/' + storyId, {});
    }

    static async me(): Promise<ICommunityStories> {
        return (await this.api.get<ICommunityStories>('/story/me', true)).data;
    }
}

export default ApiRouteStory;
