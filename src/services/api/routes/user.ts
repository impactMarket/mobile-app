import { IUserHello, IUserAuth } from 'helpers/types/endpoints';

import { getRequest, postRequest } from '../base';

class ApiRouteUser {
    static async report(
        communityId: string,
        message: string
    ): Promise<boolean> {
        return !!postRequest<boolean>(`/user/report`, {
            communityId,
            message,
        });
    }

    static async hello(
        address: string,
        token: string,
        phone: string
    ): Promise<IUserHello | undefined> {
        return postRequest<IUserHello>(`/user/hello`, {
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
        return await postRequest<IUserAuth>('/user/authenticate', {
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
        const requestBody = {
            communityId,
            gps,
        };
        const result = await postRequest<boolean>(
            '/claim-location',
            requestBody
        );
        return !!result;
    }

    static async exists(address: string): Promise<boolean> {
        return !!(await getRequest<boolean>('/user/exists/' + address));
    }

    static async setUsername(username: string): Promise<boolean> {
        const result = await postRequest<boolean>('/user/username', {
            username,
        });
        return !!result;
    }

    static async setCurrency(currency: string): Promise<boolean> {
        const result = await postRequest<boolean>('/user/currency', {
            currency,
        });
        return !!result;
    }

    static async setLanguage(language: string): Promise<boolean> {
        const result = await postRequest<boolean>('/user/language', {
            language,
        });
        console.log({ result });
        return !!result;
    }

    static async setGender(gender: string): Promise<boolean> {
        const result = await postRequest<boolean>('/user/gender', {
            gender,
        });
        return !!result;
    }

    static async setAge(age: number): Promise<boolean> {
        const result = await postRequest<boolean>('/user/age', {
            age,
        });
        return !!result;
    }

    static async setChildren(children: number | null): Promise<boolean> {
        const result = await postRequest<boolean>('/user/children', {
            children,
        });
        return !!result;
    }

    static async device(
        phone: string,
        identifier: string,
        device: string,
        network: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/device', {
            phone,
            identifier,
            device,
            network,
        });
        return !!result;
    }
}

export default ApiRouteUser;
