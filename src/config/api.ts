import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
    STORAGE_USER_ADDRESS,
    STORAGE_USER_PHONE_NUMBER,
} from 'helpers/constants';
import Api from 'services/api';

import config from '../../config';

const AxiosInstance = axios.create({
    baseURL: config.baseApiUrl,
    timeout: 20000,
});

AxiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
            return Promise.reject(new Error('Network Error'));
        } else if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const address = await AsyncStorage.getItem(STORAGE_USER_ADDRESS);
            const phone = await AsyncStorage.getItem(STORAGE_USER_PHONE_NUMBER);
            return Api.user
                .auth({ address, phone })
                .then((response) => {
                    const authTokenResponse = response.data.token;
                    AxiosInstance.defaults.headers.common['Authorization'] =
                        'Bearer ' + authTokenResponse;
                    originalRequest.headers['Authorization'] =
                        'Bearer ' + authTokenResponse;
                    return axios(originalRequest);
                })
                .catch((err) => err);
        } else {
            return error.response;
        }
    }
);

export default AxiosInstance;
