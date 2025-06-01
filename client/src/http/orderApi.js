import { $authHost } from './index';

export const createOrder = async (order) => {
  const { data } = await $authHost.post('api/order', order);
  return data;
};

export const fetchOrders = async () => {
  const { data } = await $authHost.get('api/order');
  return data;
};

export const fetchUserOrders = async () => {
  const { data } = await $authHost.get('api/order/user');
  return data;
};

export const completeOrder = async (id) => {
  const { data } = await $authHost.put(`api/order/${id}/complete`);
  return data;
};

export const deleteOrder = async (id) => {
  const { data } = await $authHost.delete(`api/order/${id}`);
  return data;
}; 