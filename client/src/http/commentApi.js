import { $authHost, $host } from './index';

export const createComment = async (comment) => {
  const { data } = await $authHost.post('/api/comment', comment);
  return data;
};

export const fetchComments = async (deviceId) => {
  const { data } = await $host.get('/api/comment', {
    params: { deviceId }
  });
  return data;
};

export const deleteComment = async (id) => {
  const { data } = await $authHost.delete(`/api/comment/${id}`);
  return data;
}; 