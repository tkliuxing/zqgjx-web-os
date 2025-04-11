import qs from 'qs';
import { requests } from './main';

export const getObj = async (resource, pk, params = null) => {
  if (!!params) {
    let resp = await requests.get(`/${resource}/${pk}/`,
      { params, paramsSerializer: paramss => qs.stringify(paramss, { indices: false }) }
    );
    return resp.data;
  } else {
    let resp = await requests.get(`/${resource}/${pk}/`);
    return resp.data;
  }
}

export const getList = async (resource, params, page = 0, pageSize = 0) => {
  if (page && pageSize) {
    params.page = page;
    params.pageSize = pageSize;
  }
  let resp = await requests.get(`/${resource}/`,
    { params, paramsSerializer: paramss => qs.stringify(paramss, { indices: false }) }
  );
  return resp.data;
}
export const getCount = async (resource, params) => {
  params.pageSize = 1;
  let resp = await requests.get(`/${resource}/`,
    { params, paramsSerializer: paramss => qs.stringify(paramss, { indices: false }) }
  );
  return resp.data.count;
}

export const createObj = async (resource, data) => {
  let resp = await requests.post(`/${resource}/`, data);
  return resp.data;
}

export const deleteObj = async (resource, pk, sys_id, template_id = null) => {
  if (template_id) {
    return await requests.delete(`/${resource}/${pk}/?sys_id=${sys_id}&template_id=${template_id}`);
  } else {
    return await requests.delete(`/${resource}/${pk}`);
  }
}

export const updateObj = async (resource, pk, data) => {
  let resp = await requests.put(`/${resource}/${pk}/`, data);
  return resp.data;
}

export const patchObj = async (resource, pk, data) => {
  let resp = await requests.patch(`/${resource}/${pk}/`, data);
  return resp.data;
}

export const getObjFromList = async (resource, params) => {
  if (!params.hasOwnProperty('page')) {
    params.page = 1;
  }
  if (!params.hasOwnProperty('pageSize')) {
    params.pageSize = 1;
  }
  let resp = await requests.get(`/${resource}/`, { params });
  let dd = resp.data;
  if (dd.hasOwnProperty('count') && dd.hasOwnProperty('next') && dd.count > 0) {
    return resp.data.data[0]
  } else {
    if (dd.length > 0) {
      return resp.data[0]
    }
  }
}

export const dataBatchDelete = async (deleteArr, template_id) => {
  let pk_list = [];
  for (let item of deleteArr) {
    pk_list.push(item.pk);
  }
  let resp = await requests.post('/data-delete/', {
    pk_list,
    template_id
  });
  return resp.data;
}

export const dataUpData = async (DataArr, template_id, update_fields) => {
  let pk_list = [];
  for (let item of DataArr) {
    pk_list.push(item.pk);
  }
  let resp = await requests.post('/data-update/', {
    pk_list,
    template_id,
    update_fields
  });
  return resp.data;
}

export const deleteList = async (querys, template_id) => {
  let resp = await requests.post('/data-delete/', {
    querys,
    template_id,
  });
  return resp.data
}

export default {
  getObj,
  getList,
  getCount,
  getObjFromList,
  createObj,
  deleteObj,
  updateObj,
  patchObj,
  dataBatchDelete,
  dataUpData,
  deleteList
}
