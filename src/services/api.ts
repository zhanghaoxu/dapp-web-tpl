import request from '@/utils/request/request';
// 查询当前用户
export const queryUserInfo = (data?: any) => {
  return request.post('/api/user/queryCurrentUser1', {
    data,
  });
};

export const login = (data?: any) => {
  return request.post('/api/user/login', {
    data,
  });
};
