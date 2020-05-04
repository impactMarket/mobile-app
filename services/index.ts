import axios from 'axios';
import config from '../config';
import { ICommunity, IBeneficiaryRequest } from '../helpers/types';


axios.defaults.baseURL = config.baseApiUrl;

async function getAllValidCommunities(): Promise<ICommunity[]> {
    let response = [] as ICommunity[];
    try {
        // handle success
        const result = await axios.get('/community/all/valid')
        response = result.data;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function requestCreateCommunity(
    requestByAddress: string,
    name: string,
    description: string,
    location: {
        title: string,
        latitude: number,
        longitude: number,
    },
    coverImage: string,
    txCreationObj: any,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success
        const requestBody = {
            requestByAddress,
            name,
            description,
            location,
            coverImage,
            txCreationObj,
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/community/request', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
}

async function requestJoinAsBeneficiary(
    walletAddress: string,
    communityPublicId: string,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success
        const requestBody = {
            walletAddress,
            communityPublicId
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/beneficiary/request', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
}

async function getBeneficiariesRequestByCommunity(
    communityPublicId: string,
): Promise<IBeneficiaryRequest[]> {
    let response = [] as IBeneficiaryRequest[];
    try {
        const result = await axios.get(`/beneficiary/${communityPublicId}`);
        response = result.data;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function acceptBeneficiaryRequest(
    acceptanceTransaction: string,
    communityPublicId: string,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success
        const requestBody = {
            acceptanceTransaction,
            communityPublicId
        };
        const requestHeaders = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        };
        const result = await axios.post('/beneficiary/accept', requestBody, requestHeaders);
        response = result.status;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response === 200 ? true : false;
}

async function getCommunityByContractAddress(
    communityContractAddress: string,
): Promise<ICommunity | undefined> {
    let response: ICommunity = undefined as any;
    try {
        const result = await axios.get(`/community/address/${communityContractAddress}`);
        response = result.data as ICommunity;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

export {
    getAllValidCommunities,
    requestCreateCommunity,
    requestJoinAsBeneficiary,
    getBeneficiariesRequestByCommunity,
    acceptBeneficiaryRequest,
    getCommunityByContractAddress,
}