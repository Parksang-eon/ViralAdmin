import request from '@/utils/request'

// 바이럴 on상태의 상시판매 리스트 가져오기
function getShowcaseList() {
  return request({
    url: '/viraladmin/v210/viral/on-list',
    method: 'get'
  })
}

// 바이럴 링크 생성 이전 계약 사항 가져오기
function getContract() {
  return request({
    url: '/viraladmin/v210/viral/contract/10153',
    method: 'get'
  })
}

// 바이럴 링크 생성하기
function getViralLink(timesaleId) {
  return request({
    url: '/viraladmin/v210/viral/link',
    method: 'post',
    data: { ...timesaleId }
  })
}

// 생성한 링크 리스트 가져오기
function getViralLinks() {
  return request({
    url: '/viraladmin/v210/viral/links',
    method: 'get'
  })
}

const regularSale = {
  getShowcaseList,
  getContract,
  getViralLink,
  getViralLinks
}

export { regularSale }
