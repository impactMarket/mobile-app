import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { STORAGE_USER_AUTH_TOKEN } from 'helpers/constants';
import ApiRouteCommunity from './routes/community';
import ApiRouteSystem from './routes/system';
import ApiRouteUser from './routes/user';

class ApiRouteUpload {
    static async uploadCommunityCoverImage(communityId: string, uri: string) {
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
            formData.append('pictureContext', 'community');
            formData.append('communityId', communityId);
            const token = await AsyncStorage.getItem(STORAGE_USER_AUTH_TOKEN);
            const requestHeaders = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
            };
            const result = await axios.post(
                '/storage/upload',
                formData,
                requestHeaders
            );
            response = result;
        } catch (error) {
            Api.system.uploadError('', 'uploadCommunityCoverImage', error);
        }
        return response;
    }
}

class Api {
    public static community = ApiRouteCommunity;
    public static user = ApiRouteUser;
    public static upload = ApiRouteUpload;
    public static system = ApiRouteSystem;
}

export default Api;
