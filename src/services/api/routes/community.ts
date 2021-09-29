import {
    CommunityCreationAttributes,
    IManagerDetailsBeneficiary,
    CommunityEditionAttributes,
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

import { ApiRequests as api, IApiResult } from '../base';

class ApiRouteCommunity {
    async getPromoter(communityId: number): Promise<IApiResult<UbiPromoter>> {
        return api.get<UbiPromoter>(`/community/${communityId}/promoter`);
    }

    async findBeneficiary(
        beneficiaryQuery: string,
        active?: boolean
    ): Promise<IManagerDetailsBeneficiary[]> {
        return (
            await api.get<IManagerDetailsBeneficiary[]>(
                '/community/beneficiaries?action=search&search=' +
                    beneficiaryQuery +
                    (active === undefined
                        ? ''
                        : active
                        ? '&active=true'
                        : '&active=false')
            )
        ).data;
    }

    async listBeneficiaries(
        active: boolean,
        offset: number,
        limit: number
    ): Promise<IManagerDetailsBeneficiary[]> {
        return (
            await api.get<IManagerDetailsBeneficiary[]>(
                '/community/beneficiaries?action=list?active=' +
                    active +
                    '&offset=' +
                    offset +
                    '&limit=' +
                    limit
            )
        ).data;
    }

    async listManagers(communityId: number): Promise<ManagerAttributes[]> {
        return (
            await api.get<ManagerAttributes[]>(
                '/community/' + communityId + '/managers/'
            )
        ).data;
    }

    async getCampaign(communityId: number): Promise<CommunityCampaing | null> {
        return (
            await api.get<CommunityCampaing | null>(
                '/community/' + communityId + '/campaign/'
            )
        ).data;
    }

    async list(query: {
        offset: number;
        limit: number;
        orderBy?: string;
        filter?: string;
        // extended?: boolean;
        lat?: number;
        lng?: number;
    }): Promise<{ data: CommunityAttributes[]; count?: number }> {
        return await api.get<CommunityAttributes[]>(
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

    async getMetrics(
        communityId: number
    ): Promise<IApiResult<UbiCommunityDailyMetrics>> {
        return api.get<UbiCommunityDailyMetrics>(
            `/community/${communityId}/metrics`
        );
    }

    async getContract(
        communityId: number
    ): Promise<IApiResult<UbiCommunityContract>> {
        return api.get<UbiCommunityContract>(
            `/community/${communityId}/contract`
        );
    }

    async getState(
        communityId: number
    ): Promise<IApiResult<UbiCommunityState>> {
        return api.get<UbiCommunityState>(`/community/${communityId}/state`);
    }

    async getSuspect(
        communityId: number
    ): Promise<IApiResult<UbiCommunitySuspect>> {
        return api.get<UbiCommunitySuspect>(
            `/community/${communityId}/suspect`
        );
    }

    async findById(id: number): Promise<CommunityAttributes> {
        // TODO: should request in parallel
        const community = (await api.get<UbiCommunity>(`/community/${id}`))
            .data;
        const metrics = (await this.getMetrics(id)).data;
        const contract = (await this.getContract(id)).data;
        const state = (await this.getState(id)).data;
        const suspect = (await this.getSuspect(id)).data;
        return {
            ...community,
            metrics,
            contract,
            state,
            suspect,
        };
    }

    async findByContractAddress(address: string): Promise<CommunityAttributes> {
        // TODO: should request in parallel
        const community = (
            await api.get<UbiCommunity>(`/community/address/${address}`)
        ).data;
        const { id } = community;
        const metrics = (await this.getMetrics(id)).data;
        const contract = (await this.getContract(id)).data;
        const state = (await this.getState(id)).data;
        const suspect = (await this.getSuspect(id)).data;
        return {
            ...community,
            metrics,
            contract,
            state,
            suspect,
        };
    }

    async preSignedUrl(
        uri: string
    ): Promise<{ uploadURL: string; media: AppMediaContent }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/community/media/' + mimetype
            )
        ).data;
        return preSigned;
    }

    async uploadImage(
        preSigned: { uploadURL: string; media: AppMediaContent },
        uri: string
    ) {
        return api.uploadImage(preSigned, uri);
    }

    async create(details: CommunityCreationAttributes) {
        return api.post<CommunityAttributes>('/community/create', details);
    }

    async edit(
        details: CommunityEditionAttributes
    ): Promise<{ data: CommunityAttributes; error: any }> {
        return api.put<CommunityAttributes>('/community', details);
    }

    async getRequestChangeUbi(
        id: number
    ): Promise<UbiRequestChangeParams | null> {
        return (
            await api.get<UbiRequestChangeParams | null>(
                '/community/' + id + '/ubi'
            )
        ).data;
    }
}

export default ApiRouteCommunity;
