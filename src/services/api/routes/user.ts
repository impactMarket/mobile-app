import { IUserHello, IUserAuth } from 'helpers/types/endpoints';
import { AppMediaContent } from 'helpers/types/models';
import path from 'path';
import * as mime from 'react-native-mime-types';

import { ApiRequests, IApiResult } from '../base';

export interface AuthParams {
    address: string;
    language: string;
    currency: string;
    phone: string;
    overwrite?: boolean;
    recover?: boolean;
    pushNotificationToken?: string;
}
class ApiRouteUser {
    static api = new ApiRequests();

    static async report(
        communityId: number,
        message: string,
        category: string | undefined
    ): Promise<boolean> {
        return (
            await this.api.post<boolean>(`/user/report`, {
                communityId,
                message,
                category,
            })
        ).data;
    }

    static async welcome(
        pushNotificationToken?: string
    ): Promise<IUserHello | undefined> {
        return (
            await this.api.post<IUserHello | undefined>(
                `/user/welcome`,
                pushNotificationToken
                    ? {
                          pushNotificationToken,
                      }
                    : {}
            )
        ).data;
    }

    static async auth(authParams: AuthParams) {
        return this.api.post<IUserAuth>('/user/auth', authParams);
    }

    static async addClaimLocation(
        communityId: number,
        gps: any
    ): Promise<boolean> {
        return (
            await this.api.post<boolean>('/claim-location', {
                communityId,
                gps,
            })
        ).data;
    }

    static async preSignedUrl(
        uri: string
    ): Promise<{ uploadURL: string; media: AppMediaContent }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await this.api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/user/media/' + mimetype,
                true
            )
        ).data;
        return preSigned;
    }
    static async uploadPicture(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ): Promise<AppMediaContent> {
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
                break;
            }
        }
        //
        await this.api.put<void>('/user/avatar', {
            mediaId: preSigned.media.id,
        });
        return preSigned.media;
    }

    static async exists(address: string): Promise<boolean> {
        return (await this.api.get<boolean>('/user/exist/' + address)).data;
    }

    static async setUsername(username: string): Promise<boolean> {
        return (
            await this.api.post<boolean>('/user/username', {
                username,
            })
        ).data;
    }

    static async setCurrency(currency: string): Promise<boolean> {
        return (
            await this.api.post<boolean>('/user/currency', {
                currency,
            })
        ).data;
    }

    static async setLanguage(language: string): Promise<boolean> {
        return (
            await this.api.post<boolean>('/user/language', {
                language,
            })
        ).data;
    }

    static async setGender(gender: string): Promise<boolean> {
        return (
            await this.api.post<boolean>('/user/gender', {
                gender,
            })
        ).data;
    }

    static async setAge(age: number): Promise<boolean> {
        return (
            await this.api.post<boolean>('/user/age', {
                age,
            })
        ).data;
    }

    static async setChildren(children: number | null): Promise<boolean> {
        return (
            await this.api.post<boolean>('/user/children', {
                children,
            })
        ).data;
    }

    static async delete(): Promise<IApiResult<boolean>> {
        return this.api.delete<boolean>('/user');
    }
}

export default ApiRouteUser;
