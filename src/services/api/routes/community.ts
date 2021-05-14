import {
    CommunityCreationAttributes,
    ICommunity,
    ICommunityLightDetails,
    IManagerDetailsBeneficiary,
    IManagerDetailsManager,
} from 'helpers/types/endpoints';
import {
    CommunityAttributes,
    ManagerAttributes,
    UbiRequestChangeParams,
} from 'helpers/types/models';

import { ApiRequests, getRequest, postRequest } from '../base';

class ApiRouteCommunity {
    static api = new ApiRequests();

    static async findBeneficiary(
        beneficiaryQuery: string,
        active?: boolean
    ): Promise<IManagerDetailsBeneficiary[]> {
        return this.api.get(
            '/community/beneficiaries?action=search&search=' +
                beneficiaryQuery +
                '/' +
                (active === undefined ? '' : active ? 'true' : 'false'),
            true
        );
    }

    static async listBeneficiaries(
        active: boolean,
        offset: number,
        limit: number
    ): Promise<IManagerDetailsBeneficiary[]> {
        return this.api.get(
            '/community/beneficiaries?action=list?active=' +
                active +
                '&offset=' +
                offset +
                '&limit=' +
                limit,
            true
        );
    }

    /**
     * @deprecated use `listManagers`
     */
    static async searchManager(managerQuery: string) {
        const result = await getRequest<IManagerDetailsManager[]>(
            '/community/managers/search/' + managerQuery,
            true
        );
        if (result) {
            return result;
        }
        throw new Error("Can't load '/managers/search'");
    }

    static async listManagers(
        communityId: number,
        offset: number,
        limit: number
    ): Promise<ManagerAttributes[]> {
        return this.api.get('/community/' + communityId + '/managers/', true);
    }

    // static async listNearest(
    //     lat: number,
    //     lng: number,
    //     offset: number,
    //     limit: number
    // ) {
    //     const result = await getRequest<ICommunityLightDetails[]>(
    //         '/community/list/light?order=nearest&lat=' +
    //             lat +
    //             '&lng=' +
    //             lng +
    //             '&offset=' +
    //             offset +
    //             '&limit=' +
    //             limit
    //     );
    //     return result ? result : [];
    // }
    static async list(query: {
        offset: number;
        limit: number;
        orderBy?: string;
        filter?: string;
        // extended?: boolean;
        lat?: number;
        lng?: number;
    }): Promise<CommunityAttributes[]> {
        return this.api.get(
            '/community/list?extended=true&offset=' +
                query.offset +
                '&limit=' +
                query.limit +
                (query.orderBy ? `&orderBy=${query.orderBy}` : '') +
                (query.filter ? `&filter=${query.filter}` : '') +
                (query.lat ? `&lat=${query.lat}` : '') +
                (query.lng ? `&lng=${query.lng}` : '')
        );
    }

    static async getByPublicId(
        publicId: string
    ): Promise<ICommunity | undefined> {
        return await getRequest<ICommunity>('/community/publicid/' + publicId);
    }

    static async getByContractAddress(
        address: string
    ): Promise<ICommunity | undefined> {
        return await getRequest<ICommunity>('/community/contract/' + address);
    }

    static async getHistoricalSSI(publicId: string): Promise<number[]> {
        const result = await getRequest<number[]>(
            '/community/hssi/' + publicId
        );
        return result ? result : [];
    }

    static async create(
        details: CommunityCreationAttributes
    ): Promise<ICommunity | undefined> {
        return (await postRequest<any>('/community/create', details)).data; // this is using a new endpoint
    }

    static async getRequestChangeUbi(
        publicId: string
    ): Promise<UbiRequestChangeParams | undefined> {
        const result = await getRequest<UbiRequestChangeParams>(
            '/community/ubiparams/' + publicId
        );
        return result;
    }
}

export default ApiRouteCommunity;
