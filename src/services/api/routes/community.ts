import {
    CommunityCreationAttributes,
    IManagerDetailsBeneficiary,
    CommunityEditionAttributes,
    IManagerDetailsManager,
} from 'helpers/types/endpoints';
import {
    AppMediaContent,
    CommunityAttributes,
    ManagerAttributes,
    UbiCommunity,
    UbiCommunitySuspect,
    UbiRequestChangeParams,
    CommunityCampaing,
    UbiPromoter,
} from 'helpers/types/models';
import { UbiCommunityContract } from 'helpers/types/ubi/ubiCommunityContract';
import { UbiCommunityDailyMetrics } from 'helpers/types/ubi/ubiCommunityDailyMetrics';
import { UbiCommunityState } from 'helpers/types/ubi/ubiCommunityState';
import path from 'path';
import * as mime from 'react-native-mime-types';

import { ApiRequests, getRequest } from '../base';

class ApiRouteCommunity {
    static api = new ApiRequests();

    static async getPromoter(communityId: number) {
        return this.api.get<UbiPromoter>(`/community/${communityId}/promoter`);
    }

    static async findBeneficiary(
        beneficiaryQuery: string,
        active?: boolean
    ): Promise<IManagerDetailsBeneficiary[]> {
        return (
            await this.api.get<IManagerDetailsBeneficiary[]>(
                '/community/beneficiaries?action=search&search=' +
                    beneficiaryQuery +
                    (active === undefined
                        ? ''
                        : active
                        ? '&active=true'
                        : '&active=false'),
                true
            )
        ).data;
    }

    static async listBeneficiaries(
        active: boolean,
        offset: number,
        limit: number
    ): Promise<IManagerDetailsBeneficiary[]> {
        return (
            await this.api.get<IManagerDetailsBeneficiary[]>(
                '/community/beneficiaries?action=list?active=' +
                    active +
                    '&offset=' +
                    offset +
                    '&limit=' +
                    limit,
                true
            )
        ).data;
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
        communityId: number
    ): Promise<ManagerAttributes[]> {
        return (
            await this.api.get<ManagerAttributes[]>(
                '/community/' + communityId + '/managers/',
                true
            )
        ).data;
    }

    static async getCampaign(
        communityId: number
    ): Promise<CommunityCampaing | null> {
        return (
            await this.api.get<CommunityCampaing | null>(
                '/community/' + communityId + '/campaign/'
            )
        ).data;
    }

    static async list(query: {
        offset: number;
        limit: number;
        orderBy?: string;
        filter?: string;
        // extended?: boolean;
        lat?: number;
        lng?: number;
    }): Promise<{ data: CommunityAttributes[]; count?: number }> {
        return await this.api.get<CommunityAttributes[]>(
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
        // TODO: should request in parallel
        const community = (await this.api.get<UbiCommunity>(`/community/${id}`))
            .data;
        const metrics = (
            await this.api.get<UbiCommunityDailyMetrics>(
                `/community/${id}/metrics`
            )
        ).data;
        const contract = (
            await this.api.get<UbiCommunityContract>(
                `/community/${id}/contract`
            )
        ).data;
        const state = (
            await this.api.get<UbiCommunityState>(`/community/${id}/state`)
        ).data;
        const suspect = (
            await this.api.get<UbiCommunitySuspect>(`/community/${id}/suspect`)
        ).data;
        return {
            ...community,
            metrics,
            contract,
            state,
            suspect,
        };
    }

    static async findByContractAddress(
        address: string
    ): Promise<CommunityAttributes> {
        // TODO: should request in parallel
        const community = (
            await this.api.get<UbiCommunity>(`/community/address/${address}`)
        ).data;
        const metrics = (
            await this.api.get<UbiCommunityDailyMetrics>(
                `/community/${community.id}/metrics`
            )
        ).data;
        const contract = (
            await this.api.get<UbiCommunityContract>(
                `/community/${community.id}/contract`
            )
        ).data;
        const state = (
            await this.api.get<UbiCommunityState>(
                `/community/${community.id}/state`
            )
        ).data;
        const suspect = (
            await this.api.get<UbiCommunitySuspect>(
                `/community/${community.id}/suspect`
            )
        ).data;
        return {
            ...community,
            metrics,
            contract,
            state,
            suspect,
        };
    }

    static async pastSSI(id: number): Promise<number[]> {
        return (await this.api.get<number[]>('/community/' + id + '/past-ssi'))
            .data;
    }

    static async preSignedUrl(
        uri: string
    ): Promise<{ uploadURL: string; media: AppMediaContent }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await this.api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/community/media/' + mimetype,
                true
            )
        ).data;
        return preSigned;
    }

    static async uploadImage(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ) {
        const resp = await fetch(uri);
        const imageBody = await resp.blob();

        const result = await fetch(preSigned.uploadURL, {
            method: 'PUT',
            body: imageBody,
        });
        if (result.status >= 400) {
            throw new Error('not uploaded');
        }
        // wait until image exists on real endpoint
        // TODO: improve this
        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
        let tries = 30;
        while (tries-- > 0) {
            await delay(1000);
            const { status } = await this.api.head(preSigned.media.url);
            if (status === 200) {
                return true;
            }
        }
        return false;
    }

    static async create(
        details: CommunityCreationAttributes
    ): Promise<{ data: CommunityAttributes; error: any }> {
        return this.api.post<CommunityAttributes>('/community/create', details);
    }

    static async edit(
        details: CommunityEditionAttributes
    ): Promise<{ data: CommunityAttributes; error: any }> {
        return this.api.put<CommunityAttributes>('/community', details);
    }

    static async getRequestChangeUbi(
        id: number
    ): Promise<UbiRequestChangeParams | null> {
        return (
            await this.api.get<UbiRequestChangeParams | null>(
                '/community/' + id + '/ubi'
            )
        ).data;
    }
}

export default ApiRouteCommunity;
