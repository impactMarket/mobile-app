import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_USER_AUTH_TOKEN, apiImageTargets } from 'helpers/constants';
import * as Sentry from 'sentry-expo';

import config from '../../../config';
import ApiRouteCommunity from './routes/community';
import ApiRouteStory from './routes/story';
import ApiRouteSystem from './routes/system';
import ApiRouteUser from './routes/user';

axios.defaults.baseURL = config.baseApiUrl;

class ApiRouteUpload {
    static async uploadImage(uri: string, type: string) {
        let response;

        try {
            // handle success
            const uriParts = uri.split('.');
            const fileType = uriParts[uriParts.length - 1];

            const formData = new FormData();
            formData.append('imageFile', {
                uri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            } as any);
            const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
            const requestHeaders = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };
            const result = await axios.post(
                //TODO: Fix tsc signature error
                apiImageTargets[type],
                formData,
                requestHeaders
            );
            response = result;
        } catch (e) {
            Sentry.Native.captureException(e);
        }
        return response;
    }
}

class Api {
    public static community = ApiRouteCommunity;
    public static user = ApiRouteUser;
    public static upload = ApiRouteUpload;
    public static system = ApiRouteSystem;
    public static story = ApiRouteStory;
}

export default Api;
