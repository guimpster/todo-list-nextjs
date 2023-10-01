import getConfig from 'next/config';

import { fetchWrapper } from '../util/fetchWrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

const register = async ({ name, email, password }) => 
    fetchWrapper.post(`${baseUrl}/user`, { name, email, password })

export const userService = {
    register
}
