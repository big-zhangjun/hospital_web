import request from '@/utils/request'

// 查询部门列表
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}
// 获取机构列表
export function getHoslist(data) {
  return request({
    url: '/hosInfo/list',
    method: 'post',
    data: data
  })
}

// 保存机构信息
export function saveHosInfo(data) {
    return request({
      url: '/hosInfo/save',
      method: 'post',
      data: data
    })
  }
  
