<template>
  <div class="modal">
    <div class="modal-section">
      <div class="modal-section-title">
        <p>제품 정보</p>
      </div>
      <div class="modal-section-content">
        <img :src="modalInfo.preview_image_uri" class="image">
        <p>{{ modalInfo.title }}</p>
        <p>{{ modalInfo.brand_name }}</p>
        <div>
          <p>{{ modalInfo.display_discount_ratio }}</p>
          <p>{{ modalInfo.display_discounted_price }}</p>
          <p>{{ modalInfo.origin_customer_price }}</p>
        </div>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">
        <p>제품 홍보 가이드</p>
      </div>
      <div class="modal-section-content">
        <p>{{ detailInfo.viralGuide }}</p>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">
        <p>제품 홍보 주의사항</p>
      </div>
      <div class="modal-section-content">
        <p>{{ detailInfo.viralWarning }}</p>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">
        <p>제품 홍보 금칙어</p>
      </div>
      <div class="modal-section-content">
        <el-tag type="danger">{{ detailInfo.viralProhibition }}</el-tag>
      </div>
    </div>
    <div class="modal-section">
      <div class="modal-section-title">
        <p>바이럴 동의</p>
      </div>
      <div class="modal-section-content">
        <el-checkbox-group v-model="agreeCheck">
          <el-checkbox
            v-for="item in selectedRequiredOption"
            :key="item.value"
            :label="item.value"
          >
            {{ item.label }}
          </el-checkbox>
          <!-- <el-checkbox>제품 홍보와 관련한 전체적인 내용에 대해 숙지 및 동의합니다.</el-checkbox>
          <el-checkbox>홍보 활동 시 주의사항과 금칙어를 지키며 활동할 것에 동의합니다.</el-checkbox> -->
        </el-checkbox-group>
      </div>
    </div>
    <el-button type="info" plain @click="createViral()">바이럴 링크 생성</el-button>
    <el-dialog
      :visible.sync="innerVisible"
      title="바이럴 링크 생성"
      width="800px"
      append-to-body
    >
      <div class="inner-modal-section">
        <div class="inner-modal-section-title">
          <p>바이럴 링크</p>
        </div>
        <div class="inner-modal-section-content">
          <p>{{ timesaleUri }}<span>아이콘 출력란</span></p>
        </div>
        <div class="inner-modal-section-content">
          <p>생성된 링크는 링크관리에서도 확인할 수 있다 등 바이럴 링크 정책에 관련된 내용 출력되는 영역입니다. 텍스트 영역</p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { regularSale } from '@/api/regular-sale'

export default {
  props: {
    modalInfo: {
      type: Array[Object],
      default: () => []
    },
    detailInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      innerVisible: false,
      agreeCheck: [],
      selectedRequiredOption: [
        { value: 'knowing', label: '제품 홍보와 관련한 전체적인 내용에 대해 숙지 및 동의합니다.' },
        { value: 'agreeing', label: '홍보 활동 시 주의사항과 금칙어를 지키며 활동할 것에 동의합니다.' }
      ],
      timesaleUri: '',
      createdLink: 0
    }
  },
  created() {
    // console.log(this.modalInfo)
    // alert('아아')
    this.test()
  },
  methods: {
    createViral() {
      const timesaleId = {
        timesale_id: `${this.modalInfo.id}`
      }
      console.log(this.agreeCheck)
      if (this.agreeCheck.length < 2) {
        alert('바이럴 링크를 생성하려면 바이럴 동의 해주세요.')
      } else {
        this.innerVisible = true
        regularSale.getViralLink(timesaleId).then((res) => {
          console.log(res)
          this.timesaleUri = res.uri
          this.createdLink += 1
          console.log(this.createdLink)
        })
        this.agreeCheck = []
      }
    },
    test() {
      if (this.linkClick >= 1) {
        this.selectedRequiredOption = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

