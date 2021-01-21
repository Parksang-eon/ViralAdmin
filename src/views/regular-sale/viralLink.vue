<template>
  <div class="app-container">
    <div class="filter">
      <div class="filter-header">
        <div class="filter-header-title">
          <span>검색 필터링</span>
          <span>필수항목<span>(*)</span>을 반드시 선택하시고 '조회하기'를 눌러주세요</span>
        </div>
      </div>
      <div class="filter-body">
        <div class="filter-body-contents">
          <div class="filter-contents-wrap">
            <div class="filter-content content-date">
              <span>조회기간<span>*</span></span>
              <el-radio-group v-model="filter.datePick" @change="selectDate(filter.datePick)">
                <el-radio v-for="item in dateList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
              <span>직접 설정</span>
              <el-date-picker
                v-model="filter.date"
                type="daterange"
                start-placeholde="시작일"
                end-placeholde="종료일"
                :default-time="['00:00:00', '23:59:59']"
              />
            </div>
          </div>
          <div class="filter-contents-wrap">
            <div class="filter-content content-keyword">
              <span>키워드</span>
              <el-input v-model="filter.keyword" clearable placeholder="키워드 내용을 정확히 입력해주세요.">
                <el-select slot="prepend" v-model="filter.keywordSelect" placeholder="키워드 선택" clearable @change="selectKeyword(filter.keywordSelect)">
                  <el-option v-for="item in keywordOption" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-input>
            </div>
            <div class="filter-content content-valid">
              <span>유효기간</span>
              <el-radio-group v-model="filter.valid" @change="selectValid(filter.valid)">
                <el-radio v-for="item in validStatus" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </div>
          </div>
        </div>
        <el-button @click="lookupLinkList()">조회하기</el-button>
      </div>
    </div>
    <div class="link-table">
      <div class="table-header">
        <div class="table-header-select">
          <span>검색결과 <span>{{ totalItemCount }}</span>건</span>
          <el-select v-model="filter.showPage" @change="selectShowPage(filter.showPage)">
            <el-option v-for="item in pageView" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <el-table
        ref="multipleTable"
        v-loading="loading"
        :data="linksForDisplay"
        border
        fit
        size="small"
        header-align="center"
      >
        <el-table-column label="브랜드명" prop="brand_name" />
        <el-table-column label="제품명" prop="title">
          <template slot-scope="{row}">
            <div>
              <img :src="row.preview_image_uri" style="width: 50px;, heigth: 50px;">
            </div>
            <p>{{ row.title }}</p>
          </template>
        </el-table-column>
        <el-table-column label="바이럴 링크" prop="external_uri" />
        <el-table-column label="생성일" prop="link_created_at" />
        <el-table-column label="유효기간" prop="expire_at" />
        <el-table-column label="발생매출(원)" prop="total_sales_amount" />
        <el-table-column label="처리" prop="link">
          <a target="_blank" :href="`${brandStoreURI}/`"><el-button type="primary">보러가기</el-button></a>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="prev, pager, next"
        style="text-align: center"
        :page-size="filter.showPage"
        :total="totalItemCount"
        :hide-on-single-page="true"
        :current-page.sync="currentPage"
        @current-change="onClickPagination"
      />
    </div>
  </div>
</template>

<script>
// import CreateLink from '@/custom/modal/CreateLink'
import { regularSale } from '@/api/regular-sale'
import { parseTime } from '@/utils'
import { processEnv } from '@/common/index'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: {
    // CreateLink
  },
  // directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      brandStoreURI: processEnv.brandStoreURI,
      totalItemCount: 0,
      MAX_ORDER_LIST_COUNT: 1500,
      filter: {
        datePick: 'all',
        date: [
          new Date(),
          new Date()
        ],
        keyword: '',
        keywordSelect: '',
        valid: 'all',
        showPage: 10,
        offSet: 0
      },
      loading: false,
      dateList: [
        { value: 'all', label: '전체' },
        { value: '1', label: '1개월' },
        { value: '2', label: '2개월' },
        { value: '3', label: '3개월' }
      ],
      keywordOption: [
        { value: 'product_name', label: '제품명' },
        { value: 'brand_name', label: '브랜드명' }
      ],
      validStatus: [
        { value: 'all', label: '전체' },
        { value: 'available', label: '유효' },
        { value: 'expiration', label: '만료' }
      ],
      pageView: [
        { value: 10, label: '10개씩보기' },
        { value: 30, label: '30개씩보기' },
        { value: 50, label: '50개씩보기' },
        { value: 100, label: '100개씩보기' },
        { value: 200, label: '200개씩보기' }
      ],
      links: [],
      linksForDisplay: [],
      extraLinks: [],
      currentPage: 1
    }
  },
  created() {
    // this.selectDate(0)
    // regularSale.getViralLinks().then((res) => {
    //   console.log(res)
    // })
  },
  methods: {
    selectDate(date) {
      this.filter.date = []
      var currentDate = new Date()
      var tempDate = new Date()
      tempDate.setHours(0, 0, 0, 0)
      currentDate.setHours(23, 59, 59, 999)
      tempDate.setDate(tempDate.getDate() - date)
      this.filter.date.push(currentDate)
      this.filter.date.push(tempDate)
      console.log(date)
    },
    selectKeyword(keyword) {
      this.filter.keywordSelect = keyword
    },
    selectValid(valid) {
      this.filter.valid = valid
    },
    selectShowPage(showPage) {
      this.filter.showPage = showPage
      this.lookupLinkList()
    },
    async lookupLinkList() {
      this.loading = true
      if (this.currentPage !== 1) {
        this.currentPage = 1
      }
      const param1 = {
        start_at: this.filter.date[0],
        end_at: this.filter.date[1],
        inquiry_class: 'initial',
        offset: this.offSet,
        limit: this.filter.showPage,
        filters: []
      }
      if (this.filter.valid !== 'all') {
        param1.filters.push({ key: `valid`, value: this.filter.valid })
      }
      if (this.filter.keywordSelect !== '') {
        param1.filters.push({ key: this.filter.keywordSelect, value: this.filter.keyword })
      }
      await regularSale.getViralLinks(param1).then((res) => {
        this.totalItemCount = res.payload.length
        console.log(param1.filters)
        // this.linksForDisplay = res.payload
      })
      const param2 = Object.assign({}, param1)
      param2.inquiry_class = 'data'
      await regularSale.getViralLinks(param2).then((res) => {
        this.links = res.payload.map((item) => {
          console.log(item)
          return {
            ...item
            // title: item.title,
            // external_uri: item.external_uri
          }
        })
        this.sliceArray()
      })
      const param3 = Object.assign({}, param2)
      param3.offset = this.filter.showPage
      param3.limit = this.MAX_ORDER_LIST_COUNT
      await regularSale.getViralLinks(param3).then((res) => {
        this.extraLinks = res.payload.map((item) => {
          return {
            ...item,
            title: item.title,
            external_uri: item.external_uri
          }
        })
        // this.links = this.links.concat(this.extraLinks)
      })
      this.loading = false
    },
    sliceArray() {
      this.linksForDisplay = this.links.slice(
        (this.currentPage - 1) * this.filter.showPage,
        this.currentPage * this.filter.showPage)
    },
    onClickPagination(index) {
      this.currentPage = index
      this.sliceArray()
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
