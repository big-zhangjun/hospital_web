import request from '@/utils/request'

export function getMeetList(data) {
    return request({
        url: '/mdt/getList',
      method: 'post',
      data: data
    })
  }
  
  export function getMeetDetail(data) {
    return request({
        url: '/mdt/getDetail',
      method: 'post',
      data: data
    })
  }
  
  export function setMeetAudit(data) {
    return request({
        url: '/mdt/audit',
      method: 'post',
      data: data
    })
  }
  