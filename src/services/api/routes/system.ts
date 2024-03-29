import { ApiRequests as api } from '../base';

class ApiRouteSystem {
    async getServerTime(): Promise<number> {
        const result = await api.get<number>('/clock');
        return result ? (result as any) : 0;
    }

    /**
     * Must use values from user storage and update when opening app.
     */
    async getExchangeRate(): Promise<{ currency: string; rate: number }[]> {
        const result = await api.get<{ currency: string; rate: number }[]>(
            '/exchange-rates'
        );
        return result ? (result as any) : [];
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
        return (await api.get<any>('/mobile/version')) as any;
    }
}

export default ApiRouteSystem;
