import http from './http';

export function getList(data = {}) {
  return http({
    url: '/stu/list',
    method: 'post',
    data
  })
}

export function save(data = {}) {
  return http({
    url: '/stu/add',
    method: 'post',
    data
  })
}

export function update(data = {}) {
  return http({
    url: '/stu/update',
    method: 'post',
    data
  })
}

export function detale(data) {
  return http({
    url: '/stu/delete/' + data.id,
    method: 'delete'
  })
}