import axios, { AxiosResponse } from 'axios';

const cache: { [url: string]: AxiosResponse } = {};

export const axiosRequest = async (url: string): Promise<AxiosResponse> => {
    if (cache[url]) {
        console.log('Cache hit for URL:', url);
        return cache[url];
    }

    console.log('Making Axios request for URL:', url);
    const response = await axios.get(url);

    cache[url] = response;

    return response;
}