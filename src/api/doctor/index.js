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
