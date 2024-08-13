import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}
// 获取医生列表
export function getDoctorlist(data) {
  return request({
    url: '/doctor/getlist',
    method: 'post',
    data: data
  })
}
// 添加医生
export function addDoctor(data) {
  return request({
    url: '/doctor/add',
    method: 'post',
    data: data
  })
}

// 删除医生
export function delDoctor(data) {
  return request({
    url: '/doctor/delete',
    method: 'post',
    data: data
  })
}

// 更新医生
export function updateDoctor(data) {
  return request({
    url: '/doctor/update',
    method: 'post',
    data: data
  })
}

// 详情
export function getDoctor(data) {
  return request({
    url: '/doctor/get',
    method: 'post',
    data: data
  })
}
