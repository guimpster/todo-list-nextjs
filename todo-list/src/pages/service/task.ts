import getConfig from 'next/config';

import { fetchWrapper } from '../util/fetchWrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}`;

const checkTask = async (task) => 
    fetchWrapper.patch(`${baseUrl}/task/${task.id}`, { endedAt: task.endedAt ? null : new Date() })

const createTask = async ({ description, projectId }) => 
    fetchWrapper.post(`${baseUrl}/task`, { description, projectId })

const _delete = async ({ taskId, projectId }) =>
    fetchWrapper.delete(`${baseUrl}/task/${taskId}?projectId=${projectId}`)

export const taskService = {
    checkTask,
    createTask,
    delete: _delete
}