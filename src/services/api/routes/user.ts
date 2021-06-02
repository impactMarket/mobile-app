import { IUserHello, IUserAuth } from 'helpers/types/endpoints';

import { ApiRequests } from '../base';

class ApiRouteUser {
    static api = new ApiRequests();

    static async report(
        communityId: string,
        message: string
    ): Promise<boolean> {
        return (
            await this.api.post<boolean>(`/user/report`, {
                communityId,
                message,
            })
        ).data;
    }

    static async hello(
        address: string,
        token: string,
        phone: string
    ): Promise<IUserHello | undefined> {
        return (
            await this.api.post<IUserHello | undefined>(`/user/welcome`, {
                address,
                token,
                phone,
            })
        ).data;
    }

    static async auth(
        address: string,
        language: string,
        currency: string,
        pushNotificationToken: string,
        phone: string
    ): Promise<IUserAuth | undefined> {
        return (
            await this.api.post<IUserAuth | undefined>('/user/auth', {
                address,
                language,
                currency,
                pushNotificationToken,
                phone,
            })
        ).data;
    }

    static async addClaimLocation(
        communityId: string,
        gps: any
    ): Promise<boolean> {
        return (
            await this.api.post<boolean>('/claim-location', {
                communityId,
                gps,
            })
        ).data;
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
}

export default ApiRouteUser;
