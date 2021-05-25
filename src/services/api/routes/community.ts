import {
    CommunityCreationAttributes,
    IManagerDetailsBeneficiary,
    CommunityEditionAttributes,
    IManagerDetailsManager,
} from 'helpers/types/endpoints';
import {
    CommunityAttributes,
    ManagerAttributes,
    UbiRequestChangeParams,
} from 'helpers/types/models';

import { ApiRequests, getRequest } from '../base';

class ApiRouteCommunity {
    static api = new ApiRequests();

    static async findBeneficiary(
        beneficiaryQuery: string,
        active?: boolean
    ): Promise<IManagerDetailsBeneficiary[]> {
        return this.api.get(
            '/community/beneficiaries?action=search&search=' +
                beneficiaryQuery +
                (active === undefined
                    ? ''
                    : active
                    ? '&active=true'
                    : '&active=false'),
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

    static async findById(id: number): Promise<CommunityAttributes> {
        return this.api.get('/community/' + id);
    }

    static async findByContractAddress(
        address: string
    ): Promise<CommunityAttributes> {
        return this.api.get('/community/address/' + address);
    }

    static async pastSSI(id: number): Promise<number[]> {
        return this.api.get('/community/' + id + '/past-ssi');
    }

    static async create(
        details: CommunityCreationAttributes
    ): Promise<CommunityAttributes> {
        return this.api.post('/community/create', details);
    }

    static async edit(
        details: CommunityEditionAttributes
    ): Promise<CommunityAttributes> {
        return this.api.put('/community', details);
    }

    static async getRequestChangeUbi(
        id: number
    ): Promise<UbiRequestChangeParams | null> {
        return this.api.get('/community/' + id + '/ubi');
    }
}

export default ApiRouteCommunity;
