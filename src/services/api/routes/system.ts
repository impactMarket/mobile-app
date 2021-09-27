import { ApiRequests } from '../base';

class ApiRouteSystem {
    api = new ApiRequests();

    async getServerTime(): Promise<number> {
        const result = await this.api.get<number>('/clock');
        return result ? result.data : 0;
    }

    /**
     * Must use values from user storage and update when opening app.
     */
    async getExchangeRate(): Promise<{ currency: string; rate: number }[]> {
        const result = await this.api.get<{ currency: string; rate: number }[]>(
            '/exchange-rates'
        );
        return result ? result.data : [];
    }

    /**
     * if undefined here happens, it means there's a connection problem
     */
    async getMobileVersion(): Promise<
        | {
              latest: string;
              minimal: string;
              timestamp: number;
          }
        | undefined
    > {
        return (await this.api.get<any>('/mobile/version')).data;
    }
}

export default ApiRouteSystem;
