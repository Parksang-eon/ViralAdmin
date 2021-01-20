import request from '@/utils/request'

// 발생한 바이럴 이력 리스트 가져오기
function getHistoryList() {
  return request({
    url: '/viraladmin/v210/viralhistory/list',
    method: 'get'
  })
}

const regularSale = {
  getHistoryList
}

export { regularSale }
