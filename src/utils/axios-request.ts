import axios, { AxiosResponse } from 'axios';

interface Cache {
  [url: string]: {
    [tier: string]: AxiosResponse;
  };
}

const cache: Cache = {};

export const axiosRequest = async (url: string, tier: string): Promise<AxiosResponse> => {
  if (cache[url] && cache[url][tier]) {
    console.log('Cache hit for URL and tier:', url, tier);
    return cache[url][tier];
  }

  console.log('Making Axios request for URL and tier:', url, tier);
  const response = await axios.get(url);

  if (!cache[url]) {
    cache[url] = {};
  }

  cache[url][tier] = response;

  return response;
};