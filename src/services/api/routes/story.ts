import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import {
    ICommunitiesListStories,
    ICommunityStories,
} from 'helpers/types/endpoints';
import config from '../../../../config';
import { getRequest, postRequest, deleteRequest, putRequest } from '../base';
import * as Sentry from 'sentry-expo';
import { AppMediaContent } from 'helpers/types/models';
import { StoryContent } from 'helpers/types/story/storyContent';

axios.defaults.baseURL = config.baseApiUrl;

class ApiRouteStory {
    static async addPicture(mediaURI: string): Promise<AppMediaContent> {
        let response;
        try {
            // handle success
            const uriParts = mediaURI.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            console.log(mediaURI.length);
            if (mediaURI.length > 0) {
                formData.append('imageFile', {
                    uri: mediaURI,
                    name: `photo.${fileType}`,
                    type: `image/${fileType}`,
                } as any);
            }
            const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
            const requestHeaders = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };
            console.log(formData);
            const result = await axios.post(
                '/story/picture',
                formData,
                requestHeaders
            );
            response = result.data;
        } catch (e) {
            Sentry.Native.captureException(e);
        }
        return response;
    }

    static async add(
        communityId: number,
        message?: string,
        mediaId?: number
    ): Promise<StoryContent> {
        console.log('xxxxxxxxxxxxxxxxx');
        console.log({
            communityId,
            message,
            mediaId,
        });
        console.log('xxxxxxxxxxxxxxxxx');
        return await postRequest<any>('/story', {
            communityId,
            message,
            mediaId,
        });
    }

    static async list<T extends ICommunitiesListStories[]>(): Promise<T> {
        const result = await getRequest<T>('/story/list');
        return result ? result : ([] as any);
    }

    static async getByCommunity(
        communityId: number,
        isUserLogged: boolean // TODO: this must change
    ): Promise<ICommunityStories> {
        const result = await getRequest<ICommunityStories>(
            '/story/community/' + communityId,
            isUserLogged
        );
        return result!; // TODO: don't!
    }

    static async love(storyId: number): Promise<void> {
        await putRequest('/story/love/' + storyId, {});
        return;
    }

    static async inapropriate(storyId: number): Promise<void> {
        await putRequest('/story/inapropriate/' + storyId, {});
        return;
    }

    static async remove(storyId: number): Promise<void> {
        await deleteRequest('/story/' + storyId, {});
        return;
    }

    static async me<T extends ICommunitiesListStories[]>(): Promise<T> {
        const result = await getRequest<T>('/story/me');
        return result ? result : ([] as any);
    }
}

export default ApiRouteStory;
