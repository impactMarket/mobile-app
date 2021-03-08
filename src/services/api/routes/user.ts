import { IUserHello, IUserAuth } from 'helpers/types/endpoints';
import { getRequest, postRequest } from '../base';

class ApiRouteUser {
    static async hello(
        address: string,
        token: string
    ): Promise<IUserHello | undefined> {
        return postRequest<IUserHello>(`/user/hello`, {
            address,
            token,
        });
    }

    static async auth(
        address: string,
        language: string,
        currency: string,
        pushNotificationToken: string
    ): Promise<IUserAuth | undefined> {
        return await postRequest<IUserAuth>('/user/authenticate', {
            address,
            language,
            currency,
            pushNotificationToken,
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

    static async setUsername(
        address: string,
        username: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/username', {
            address,
            username,
        });
        return !!result;
    }

    static async setCurrency(
        address: string,
        currency: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/currency', {
            address,
            currency,
        });
        return !!result;
    }

    static async setLanguage(
        address: string,
        language: string
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/language', {
            address,
            language,
        });
        return !!result;
    }

    static async setGender(address: string, gender: string): Promise<boolean> {
        const result = await postRequest<boolean>('/user/gender', {
            address,
            gender,
        });
        return !!result;
    }

    static async setAge(address: string, age: number): Promise<boolean> {
        const result = await postRequest<boolean>('/user/age', {
            address,
            age,
        });
        return !!result;
    }

    static async setChildren(
        address: string,
        children: number | null
    ): Promise<boolean> {
        const result = await postRequest<boolean>('/user/children', {
            address,
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
