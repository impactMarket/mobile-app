import axios from 'axios';
import config from '../config';
import { ICommunity, IBeneficiary, ICommunityVars } from '../helpers/types';
import { BigNumber } from 'ethers/utils';


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
): Promise<IBeneficiary[]> {
    let response = [] as IBeneficiary[];
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

async function findComunityToBeneficicary(
    beneficiaryAddress: string,
): Promise<ICommunity | undefined> {
    let response: ICommunity | undefined = undefined;
    try {
        const result = await axios.get(`/transactions/beneficiaryin/${beneficiaryAddress}`);
        if (result.data === "") {
            response = undefined;
        } else {
            response = result.data;
        }
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function findComunityToManager(
    managerAddress: string,
): Promise<ICommunity | undefined> {
    let response: ICommunity | undefined = undefined;
    try {
        const result = await axios.get(`/transactions/managerin/${managerAddress}`);
        if (result.data === "") {
            response = undefined;
        } else {
            response = result.data;
        }
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

async function getBeneficiariesInCommunity(
    communityContractAddress: string,
): Promise<string[]> {
    let response: string[] = [];
    try {
        const result = await axios.get(`/transactions/community/beneficiaries/${communityContractAddress}`);
        response = result.data as string[];
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getCommunityManagersInCommunity(
    communityContractAddress: string,
): Promise<string[]> {
    let response: string[] = [];
    try {
        const result = await axios.get(`/transactions/community/managers/${communityContractAddress}`);
        response = result.data as string[];
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getBackersInCommunity(
    communityContractAddress: string,
): Promise<string[]> {
    let response: string[] = [];
    try {
        const result = await axios.get(`/transactions/community/backers/${communityContractAddress}`);
        response = result.data as string[];
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getCommunityVars(
    communityContractAddress: string,
): Promise<ICommunityVars> {
    let response: ICommunityVars = {} as any;
    try {
        const result = await axios.get(`/transactions/community/vars/${communityContractAddress}`);
        response = {
            _amountByClaim: new BigNumber(result.data._amountByClaim),
            _baseIntervalTime: new BigNumber(result.data._amountByClaim),
            _incIntervalTime: new BigNumber(result.data._amountByClaim),
            _claimHardCap: new BigNumber(result.data._amountByClaim)
        };
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getCommunityRaisedAmount(
    communityContractAddress: string,
): Promise<BigNumber> {
    let response = new BigNumber(0);
    try {
        const result = await axios.get(`/transactions/community/raised/${communityContractAddress}`);
        response = new BigNumber(result.data);
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}

async function getCommunityClaimedAmount(
    communityContractAddress: string,
): Promise<BigNumber> {
    let response = new BigNumber(0);
    try {
        const result = await axios.get(`/transactions/community/claimed/${communityContractAddress}`);
        response = new BigNumber(result.data);
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
    findComunityToBeneficicary,
    findComunityToManager,
    acceptBeneficiaryRequest,
    getCommunityByContractAddress,
    getBeneficiariesInCommunity,
    getCommunityManagersInCommunity,
    getBackersInCommunity,
    getCommunityVars,
    getCommunityRaisedAmount,
    getCommunityClaimedAmount,
}