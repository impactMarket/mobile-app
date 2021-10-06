import { IUserHello, IUserAuth } from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import path from 'path';
import * as mime from 'react-native-mime-types';

import { ApiRequests as api, IApiResult } from '../base';

export interface AuthParams {
    address: string;
    phone: string;
    language?: string;
    currency?: string;
    overwrite?: boolean;
    recover?: boolean;
    pushNotificationToken?: string;
}
class ApiRouteUser {
    async readRules(
        category: 'beneficiary' | 'manager'
    ): Promise<IApiResult<boolean>> {
        return api.put<boolean>(`/user/read-rules/${category}`, {});
    }

    async report(
        communityId: number,
        message: string,
        category: string | undefined
    ): Promise<boolean> {
        return (
            await api.post<boolean>(`/user/report`, {
                communityId,
                message,
                category,
            })
        ).data;
    }

    async welcome(
        pushNotificationToken?: string
    ): Promise<IUserHello | undefined> {
        return (
            await api.post<IUserHello | undefined>(
                `/user/welcome`,
                pushNotificationToken
                    ? {
                          pushNotificationToken,
                      }
                    : {}
            )
        ).data;
    }

    async auth(authParams: AuthParams) {
        return api.post<IUserAuth>('/user/auth', authParams);
    }

    async addClaimLocation(communityId: number, gps: any): Promise<boolean> {
        return (
            await api.post<boolean>('/claim-location', {
                communityId,
                gps,
            })
        ).data;
    }

    async preSignedUrl(
        uri: string
    ): Promise<{ uploadURL: string; media: AppMediaContent }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/user/media/' + mimetype
            )
        ).data;
        return preSigned;
    }
    async uploadPicture(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ): Promise<AppMediaContent> {
        await api.uploadImage(preSigned, uri);
        //
        await api.put<void>('/user/avatar', {
            mediaId: preSigned.media.id,
        });
        return preSigned.media;
    }

    async exists(address: string): Promise<boolean> {
        return (await api.get<boolean>('/user/exist/' + address)).data;
    }

    async setUsername(username: string): Promise<boolean> {
        return (
            await api.post<boolean>('/user/username', {
                username,
            })
        ).data;
    }

    async setCurrency(currency: string): Promise<boolean> {
        return (
            await api.post<boolean>('/user/currency', {
                currency,
            })
        ).data;
    }

    async setLanguage(language: string): Promise<boolean> {
        return (
            await api.post<boolean>('/user/language', {
                language,
            })
        ).data;
    }

    async setGender(gender: string): Promise<boolean> {
        return (
            await api.post<boolean>('/user/gender', {
                gender,
            })
        ).data;
    }

    async setAge(age: number): Promise<boolean> {
        return (
            await api.post<boolean>('/user/age', {
                age,
            })
        ).data;
    }

    async setChildren(children: number | null): Promise<boolean> {
        return (
            await api.post<boolean>('/user/children', {
                children,
            })
        ).data;
    }

    async delete(): Promise<IApiResult<boolean>> {
        return api.delete<boolean>('/user');
    }
}

export default ApiRouteUser;
