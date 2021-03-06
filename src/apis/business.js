import request from '@/utils/request';

export const login = data =>
    request('/api/user/login', {
        method: 'post',
        data,
    });

export const getCurrentUser = data =>
    request('/api/user/getCurrentUser', {
        method: 'get',
    });

export const saveSetting = data =>
    request('/api/user/update', {
        method: 'post',
        data,
    });

export const getCurrentUserOrder = data =>
    request('/api/user/getCurrentUserOrder', {
        method: 'get',
    });

export const addUser = data =>
    request('/api/user/add', {
        method: 'post',
        data,
    });

export const updateUsers = data =>
    request('/api/user/updateUsers', {
        method: 'post',
        data,
    });

export const getCustomerUser = data =>
    request('/api/user/getOwnList', {
        method: 'get',
        params: data,
    });

export const getOwnUnReadedOrder = () =>
    request('/api/user/getOwnUnReadedOrder', {
        method: 'get',
    });

export const delOwnUser = data =>
    request('/api/user/delOwnUser', {
        method: 'post',
        data,
    });

export const getOwnOrderList = data =>
    request('/api/user/getOwnOrderList', {
        method: 'get',
        params: data,
    });

export const delOwnOrder = data =>
    request('/api/user/delOwnOrder', {
        method: 'post',
        data,
    });
export const mergeOrder = data =>
    request('/api/order/merge', {
        method: 'post',
        data,
    });

export const mergeCapsuleOrder = data =>
    request('/api/capsuleOrder/merge', {
        method: 'post',
        data,
    });

export const mergeShopOrder = data =>
    request('/api/shopOrder/merge', {
        method: 'post',
        data,
    });


export const getOrderDetail = data =>
    request('/api/order/detail', {
        method: 'get',
        params: data,
    });

export const getCapsuleOrderDetail = data =>
    request('/api/capsuleOrder/detail', {
        method: 'get',
        params: data,
    });

export const getShopOrderDetail = data =>
    request('/api/shopOrder/detail', {
        method: 'get',
        params: data,
    });
    