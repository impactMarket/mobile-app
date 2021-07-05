import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import {
    ICommunitiesListStories,
    ICommunityStories,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import path from 'path';
import * as mime from 'react-native-mime-types';

import config from '../../../../config';
import { ApiRequests } from '../base';

axios.defaults.baseURL = config.baseApiUrl;

class ApiRouteStory {
    static api = new ApiRequests();

    static async add(
        uri: string | undefined,
        story: {
            communityId: number;
            message?: string;
            mediaId?: number;
        }
    ): Promise<ICommunityStory> {
        if (uri) {
            const mimetype = mime
                .contentType(path.basename(uri))
                .match(/\/(\w+);?/)[1];
            const preSigned = (
                await this.api.get<{
                    uploadURL: string;
                    media: AppMediaContent;
                }>('/story/media/' + mimetype, true)
            ).data;
            const ru = await FileSystem.uploadAsync(preSigned.uploadURL, uri, {
                httpMethod: 'PUT',
                mimeType: mimetype,
                uploadType: 0, //FileSystemUploadType.BINARY_CONTENT
                headers: {
                    'Content-Type': 'image/' + mimetype,
                },
            });
            if (ru.status >= 400) {
                throw new Error(ru.body.toString());
            }
            // wait until image exists on real endpoint
            // TODO: improve this
            const delay = (ms: number) =>
                new Promise((resolve) => setTimeout(resolve, ms));
            let tries = 3;
            while (tries-- > 0) {
                delay(1000);
                const { status } = await this.api.head(preSigned.media.url);
                if (status === 200) {
                    break;
                }
            }
            //
            story = {
                ...story,
                mediaId: preSigned.media.id,
            };
        }
        return (await this.api.post<ICommunityStory>('/story', story)).data;
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
