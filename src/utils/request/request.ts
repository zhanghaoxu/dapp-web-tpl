/**
 * request 基于 axios 封装的请求工具
 * 20220809 POST新增加密选项 encrypt
 */

import { history } from 'umi';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dataEncryption from '../dataEncryption';
import { API_PREFIX, LOGIN_EXPIRE_CODE, SUCCESS_CODE, TIME_OUT, HTTP_ERROR_MESSAGE } from './config';
import { useRequest } from 'ahooks';
const BusinessError = 'BusinessError';
const HttpError = 'HttpError';

interface AxiosRequestConfigExtend extends AxiosRequestConfig {
  encrypt?: boolean;
}

//需要自己实现
const message = {
  error: (i: string) => {
    console.log(i);
  },
};

const client = axios.create({
  baseURL: API_PREFIX,
  timeout: TIME_OUT,
  withCredentials: true, // 默认请求是否带上cookie
});

// Same as the last one
client.interceptors.request.use((options: AxiosRequestConfigExtend) => {
  //加密处理
  if (options.encrypt) {
    const oldData = options.data;
    if (oldData) {
      const result = dataEncryption.encrypt(oldData);
      if (result) {
        const { key, ciphertext } = result;
        options.data = {
          encContent: ciphertext,
          encKey: key,
        };
      }
    }
  }
  return options;
});

/*
 response 拦截器, 对响应做处理
 */
client.interceptors.response.use(async (response: AxiosResponse) => {
  try {
    const { code, msg, data } = response.data;
    if (code === SUCCESS_CODE) {
      return Promise.resolve({ data });
    } else if (code) {
      const error = {
        type: BusinessError,
        code,
        msg,
      };
      message.error(error.msg);
      if (error.code === LOGIN_EXPIRE_CODE) {
        history.replace('/login');
        return;
      }
      return Promise.resolve({ error });
    } else {
      const error = {
        type: HttpError,
        code: response.status,
        msg: HTTP_ERROR_MESSAGE,
      };
      message.error(error.msg);
      return Promise.resolve({ error });
    }
  } catch (error) {
    return Promise.resolve(error);
  }
});

export default {
  get: (url: string, otherOptions: AxiosRequestConfigExtend = {}) => {
    return client.get(url, { ...otherOptions });
  },
  post: (url: string, otherOptions: AxiosRequestConfigExtend = {}) => {
    if (!otherOptions.data) otherOptions.data = {};
    return client.post(url, { ...otherOptions });
  },
};
