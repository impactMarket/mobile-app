import {
    CommunityCreationAttributes,
    CommunityEditionAttributes,
    ICommunity,
    ICommunityLightDetails,
    IManagerDetailsBeneficiary,
    IManagerDetailsManager,
} from 'helpers/types/endpoints';
import { UbiRequestChangeParams } from 'helpers/types/models';

import { getRequest, postRequest } from '../base';

class ApiRouteCommunity {
    static async findBeneficiary(beneficiaryQuery: string, active?: boolean) {
        const result = await getRequest<IManagerDetailsBeneficiary[]>(
            '/community/beneficiaries/find/' +
                beneficiaryQuery +
                '/' +
                (active === undefined ? '' : active ? 'true' : 'false'),
            true
        );
        if (result) {
            return result;
        }
        throw new Error("Can't load '/beneficiary/search'");
    }

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

    static async listBeneficiaries(
        active: boolean,
        offset: number,
        limit: number
    ) {
        const result = await getRequest<IManagerDetailsBeneficiary[]>(
            '/community/beneficiaries/list/' +
                active +
                '/' +
                offset +
                '/' +
                limit,
            true
        );
        if (result) {
            return result;
        }
        throw new Error("Can't load '/beneficiary/search'");
    }

    static async listManagers(offset: number, limit: number) {
        const result = await getRequest<IManagerDetailsManager[]>(
            '/community/managers/list/' + offset + '/' + limit,
            true
        );
        if (result) {
            return result;
        }
        throw new Error("Can't load '/manager/search'");
    }

    static async listNearest(
        lat: number,
        lng: number,
        offset: number,
        limit: number
    ) {
        const result = await getRequest<ICommunityLightDetails[]>(
            '/community/list/light?order=nearest&lat=' +
                lat +
                '&lng=' +
                lng +
                '&offset=' +
                offset +
                '&limit=' +
                limit
        );
        return result ? result : [];
    }
    static async list(offset: number, limit: number) {
        const result = await getRequest<ICommunityLightDetails[]>(
            '/community/list/light?offset=' + offset + '&limit=' + limit
        );
        return result ? result : [];
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

    static async edit(
        details: CommunityEditionAttributes
    ): Promise<ICommunity | undefined> {
        return await postRequest<any>('/community/edit', details);
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
