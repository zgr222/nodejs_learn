import http from './http';

export function uploadVueError(data = {}) {
  return http({
    url: '/sys/reportVueError',
    method: 'post',
    data
  })
}

export function uploadWindowError(data = {}) {
  return http({
    url: '/sys/reportWindowError',
    method: 'post',
    data
  })
}