import getConfig from 'next/config';

import { fetchWrapper } from '../util/fetchWrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

const getProjects = async () => 
    fetchWrapper.get(`${baseUrl}/project`)

const _delete = async (projectId) =>
    fetchWrapper.delete(`${baseUrl}/project/${projectId}`)

const add = async ({ title }) =>
    fetchWrapper.post(`${baseUrl}/project`, { title })

const edit = async ({ projectId, title }) =>
    fetchWrapper.patch(`${baseUrl}/project/${projectId}`, { title })

export const projectService = {
    getProjects,
    delete: _delete,
    add,
    edit
}