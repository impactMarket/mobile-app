import Constants from 'expo-constants';
import { getRequest, postRequest } from '../base';

class ApiRouteSystem {
    static async getServerTime(): Promise<number> {
        const result = await getRequest<number>('/clock');
        return result ? result : 0;
    }

    /**
     * Must use values from user storage and update when opening app.
     */
    static async getExchangeRate(): Promise<
        { currency: string; rate: number }[]
    > {
        const result = await getRequest<{
            rates: { currency: string; rate: number }[];
        }>('/exchange-rates');
        return result ? result.rates : [];
    }

    static async uploadError(
        address: string,
        action: string,
        error: any,
        errorShown: string = ''
    ): Promise<boolean> {
        const requestBody = {
            version: Constants.manifest.version,
            address,
            action,
            error: JSON.stringify({
                reason: error.reason,
                message: error.message,
                errorShown,
            }),
        };
        const result = await postRequest<boolean>('/mobile/error', requestBody);
        return !!result;
    }

    /**
     * if undefined here happens, it means there's a connection problem
     */
    static async getMobileVersion(): Promise<
        | {
              latest: string;
              minimal: string;
              timestamp: number;
          }
        | undefined
    > {
        return await getRequest<any>('/mobile/version');
    }
}

export default ApiRouteSystem;
