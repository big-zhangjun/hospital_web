import request from '@/utils/request'


// 获取团队列表
export function getTeamlist(data) {
    return request({
        url: '/team/getlist',
        method: 'post',
        data: data
    })
}
// 添加团队
export function addTeam(data) {
    return request({
        url: '/team/add',
        method: 'post',
        data: data
    })
}
// 团队信息
export function getTeam(data) {
    return request({
        url: '/team/get',
        method: 'post',
        data: data
    })
}
// 更新
export function updateTeam(data) {
    return request({
        url: '/team/update',
        method: 'post',
        data: data
    })
}
// 删除
export function delTeam(data) {
    return request({
        url: '/team/delete',
        method: 'post',
        data: data
    })
}

// 获取MDT团队列表
export function getMdtTeamlist(data) {
    return request({
        url: '/mdtTeam/getlist',
        method: 'post',
        data: data
    })
}

// 添加MDT团队
export function addMdtTeam(data) {
    return request({
        url: '/mdtTeam/add',
        method: 'post',
        data: data
    })
}
// 团队MDT信息
export function getMdtTeam(data) {
    return request({
        url: '/mdtTeam/get',
        method: 'post',
        data: data
    })
}
// 更新MDT
export function updateMdtTeam(data) {
    return request({
        url: '/mdtTeam/update',
        method: 'post',
        data: data
    })
}
// 删除MDT
export function delMdtTeam(data) {
    return request({
        url: '/mdtTeam/delete',
        method: 'post',
        data: data
    })
}