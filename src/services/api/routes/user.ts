import { IUserHello, IUserAuth } from 'helpers/types/endpoints';

import { ApiRequests } from '../base';

class ApiRouteUser {
    static api = new ApiRequests();

    static async report(
        communityId: string,
        message: string
    ): Promise<boolean> {
        return this.api.post(`/user/report`, {
            communityId,
            message,
        });
    }

    static async hello(
        address: string,
        token: string,
        phone: string
    ): Promise<IUserHello | undefined> {
        return this.api.post(`/user/welcome`, {
            address,
            token,
            phone,
        });
    }

    static async auth(
        address: string,
        language: string,
        currency: string,
        pushNotificationToken: string,
        phone: string
    ): Promise<IUserAuth | undefined> {
        return this.api.post('/user/auth', {
            address,
            language,
            currency,
            pushNotificationToken,
            phone,
        });
    }

    static async addClaimLocation(
        communityId: string,
        gps: any
    ): Promise<boolean> {
        return this.api.post('/claim-location', {
            communityId,
            gps,
        });
    }

    static async exists(address: string): Promise<boolean> {
        return this.api.get('/user/exist/' + address);
    }

    static async setUsername(username: string): Promise<boolean> {
        return this.api.post('/user/username', {
            username,
        });
    }

    static async setCurrency(currency: string): Promise<boolean> {
        return this.api.post('/user/currency', {
            currency,
        });
    }

    static async setLanguage(language: string): Promise<boolean> {
        return this.api.post('/user/language', {
            language,
        });
    }

    static async setGender(gender: string): Promise<boolean> {
        return this.api.post('/user/gender', {
            gender,
        });
    }

    static async setAge(age: number): Promise<boolean> {
        return this.api.post('/user/age', {
            age,
        });
    }

    static async setChildren(children: number | null): Promise<boolean> {
        return this.api.post('/user/children', {
            children,
        });
    }

    static async device(
        phone: string,
        identifier: string,
        device: string,
        network: string
    ): Promise<boolean> {
        return this.api.post('/user/device', {
            phone,
            identifier,
            device,
            network,
        });
    }
}

export default ApiRouteUser;
