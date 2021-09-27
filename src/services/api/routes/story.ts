import {
    ICommunitiesListStories,
    ICommunityStories,
    ICommunityStory,
} from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import path from 'path';
import * as mime from 'react-native-mime-types';

import { ApiRequests as api, IApiResult } from '../base';

class ApiRouteStory {
    async preSignedUrl(
        uri: string
    ): Promise<{ uploadURL: string; media: AppMediaContent }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/story/media/' + mimetype
            )
        ).data;
        return preSigned;
    }

    async uploadImage(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ) {
        return api.uploadImage(preSigned, uri);
    }

    async add(story: {
        communityId: number;
        message?: string;
        mediaId?: number;
    }): Promise<IApiResult<ICommunityStory>> {
        return api.post<ICommunityStory>('/story', story);
    }

    async list<T extends ICommunitiesListStories[]>(
        offset?: number,
        limit?: number
    ): Promise<IApiResult<T>> {
        return api.get<T>(
            '/story/list?includeIPCT=true' +
                (offset !== undefined ? `&offset=${offset}` : '') +
                (limit !== undefined ? `&limit=${limit}` : '')
        );
    }

    async getByCommunity(communityId: number): Promise<ICommunityStories> {
        return (
            await api.get<ICommunityStories>('/story/community/' + communityId)
        ).data;
    }

    async love(storyId: number): Promise<IApiResult<any>> {
        return api.put('/story/love/' + storyId, {});
    }

    async inapropriate(storyId: number): Promise<IApiResult<any>> {
        return api.put('/story/inapropriate/' + storyId, {});
    }

    async remove(storyId: number): Promise<IApiResult<void>> {
        return api.delete<void>('/story/' + storyId, {});
    }

    async me(): Promise<IApiResult<ICommunityStories>> {
        return await api.get<ICommunityStories>('/story/me');
    }
}

export default ApiRouteStory;
