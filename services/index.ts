import axios from 'axios';
import config from '../config';


interface ICommunity {
    publicId: string;
    requestByAddress: string;
    contractAddress: string;
    name: string;
    description: string;
    location: {
        title: string;
        latitude: number;
        longitude: number;
    };
    coverImage: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

axios.defaults.baseURL = config.baseApiUrl;

export async function getAllCommunities(): Promise<ICommunity[]> {
    let response = [] as ICommunity[];
    try {
        // handle success
        const result = await axios.get('/community/all')
        response = result.data;
    } catch (error) {
        // handle error
    } finally {
        // always executed
    }
    return response;
}


export async function requestCreateCommunity(
    requestByAddress: string,
    name: string,
    description: string,
    locationTitle: string,
    coverImage: string,
): Promise<boolean> {
    let response = 500;
    try {
        // handle success

        const requestBody = {
            requestByAddress,
            name,
            description,
            location: {
                title: locationTitle,
                latitude: 5,
                longitude: 6,
            },
            coverImage,
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