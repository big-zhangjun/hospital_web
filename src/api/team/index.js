import request from '@/utils/request'

// 查询部门列表
export function getTeamlist(query) {
  return request({
    url: '/team/getlist',
    method: 'post',
    data: query
  })
}

