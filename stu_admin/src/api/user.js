import http from './http';

export function regist(data = {}) {
  return http({
    url: '/user/regist',
    method: 'post',
    data
  })
}

export function login(data = {}) {
  return http({
    url: '/user/login',
    method: 'post',
    data
  })
}