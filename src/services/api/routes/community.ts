import * as FileSystem from 'expo-file-system';
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
    UbiRequestChangeParams,
} from 'helpers/types/models';
import path from 'path';
import * as mime from 'react-native-mime-types';

import { ApiRequests, getRequest } from '../base';

class ApiRouteCommunity {
    static api = new ApiRequests();

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
        communityId: number,
        offset: number,
        limit: number
    ): Promise<ManagerAttributes[]> {
        return (
            await this.api.get<ManagerAttributes[]>(
                '/community/' + communityId + '/managers/',
                true
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
    }): Promise<CommunityAttributes[]> {
        return (
            await this.api.get<CommunityAttributes[]>(
                '/community/list?extended=true&offset=' +
                    query.offset +
                    '&limit=' +
                    query.limit +
                    (query.orderBy ? `&orderBy=${query.orderBy}` : '') +
                    (query.filter ? `&filter=${query.filter}` : '') +
                    (query.lat ? `&lat=${query.lat}` : '') +
                    (query.lng ? `&lng=${query.lng}` : '')
            )
        ).data;
    }

    static async findById(id: number): Promise<CommunityAttributes> {
        return (await this.api.get<CommunityAttributes>('/community/' + id))
            .data;
    }

    static async findByContractAddress(
        address: string
    ): Promise<CommunityAttributes> {
        return (
            await this.api.get<CommunityAttributes>(
                '/community/address/' + address
            )
        ).data;
    }

    static async pastSSI(id: number): Promise<number[]> {
        return (await this.api.get<number[]>('/community/' + id + '/past-ssi'))
            .data;
    }

    static async create(
        uri: string,
        details: CommunityCreationAttributes
    ): Promise<{ data: CommunityAttributes; error: any }> {
        const mimetype = mime
            .contentType(path.basename(uri))
            .match(/\/(\w+);?/)[1];
        const preSigned = (
            await this.api.get<{ uploadURL: string; media: AppMediaContent }>(
                '/community/media/' + mimetype,
                true
            )
        ).data;
        const ru = await FileSystem.uploadAsync(preSigned.uploadURL, uri, {
            httpMethod: 'PUT',
            mimeType: mimetype,
            uploadType: 0, //FileSystemUploadType.BINARY_CONTENT
            headers: {
                'Content-Type': 'image/' + mimetype,
            },
        });
        if (ru.status >= 400) {
            throw new Error(ru.body.toString());
        }
        // wait until image exists on real endpoint
        // TODO: improve this
        const delay = (ms: number) =>
            new Promise((resolve) => setTimeout(resolve, ms));
        let tries = 3;
        while (tries-- > 0) {
            delay(1000);
            const { status } = await this.api.head(preSigned.media.url);
            if (status === 200) {
                break;
            }
        }
        //
        details = {
            ...details,
            coverMediaId: preSigned.media.id,
        };
        return this.api.post<CommunityAttributes>('/community/create', details);
    }

    static async edit(
        uri: string | undefined,
        details: CommunityEditionAttributes
    ): Promise<CommunityAttributes> {
        if (uri) {
            const mimetype = mime
                .contentType(path.basename(uri))
                .match(/\/(\w+);?/)[1];
            const preSigned = (
                await this.api.get<{
                    uploadURL: string;
                    media: AppMediaContent;
                }>('/community/media/' + mimetype, true)
            ).data;
            const ru = await FileSystem.uploadAsync(preSigned.uploadURL, uri, {
                httpMethod: 'PUT',
                mimeType: mimetype,
                uploadType: 0, //FileSystemUploadType.BINARY_CONTENT
                headers: {
                    'Content-Type': 'image/' + mimetype,
                },
            });
            if (ru.status >= 400) {
                throw new Error(ru.body.toString());
            }
            // wait until image exists on real endpoint
            // TODO: improve this
            const delay = (ms: number) =>
                new Promise((resolve) => setTimeout(resolve, ms));
            let tries = 3;
            while (tries-- > 0) {
                delay(1000);
                const { status } = await this.api.head(preSigned.media.url);
                if (status === 200) {
                    break;
                }
            }
            //
            details = {
                ...details,
                coverMediaId: preSigned.media.id,
            };
        }
        return this.api.put('/community', details);
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
