import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import { ICommunityStories } from 'helpers/types/endpoints';
import config from '../../../../config';
import { getRequest } from '../base';

axios.defaults.baseURL = config.baseApiUrl;

class ApiRouteStory {
    static async add(
        mediaURI: string,
        communityId: number,
        message: string,
        userAddress: string
    ): Promise<any> {
        let response;
        try {
            // handle success
            const uriParts = mediaURI.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            formData.append('imageFile', {
                uri: mediaURI,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);
            formData.append('byAddress', userAddress);
            formData.append('communityId', communityId.toString());
            formData.append('message', message);
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
                '/stories/add',
                formData,
                requestHeaders
            );
            response = result;
        } catch (error) {
            // Api.system.uploadError('', 'uploadCommunityCoverImage', error);
        }
        return response;
    }

    static async get<T extends ICommunityStories[]>(): Promise<T> {
        const result = await getRequest<T>('/stories/get');
        return result ? result : ([] as any);
    }
}

export default ApiRouteStory;
