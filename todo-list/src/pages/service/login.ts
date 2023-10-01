import getConfig from 'next/config';
import Router from 'next/router'

import { fetchWrapper } from '../util/fetchWrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

const logout = async () => {
    await fetchWrapper.post(`${baseUrl}/logout`, {});
    Router.push('/home');
}

const login = async ({ email, password }) => 
    fetchWrapper.post(`${baseUrl}/login`, { email, password })

const getLoggedUser = async () => 
    fetchWrapper.get(`${baseUrl}/user`)

export const loginService = {
    login,
    logout,
    getLoggedUser
};