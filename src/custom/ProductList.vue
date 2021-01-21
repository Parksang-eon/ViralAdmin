<template>
  <div>
    <el-row class="aa">
      <!-- <el-col v-for="(o, index) in 20" :key="o" :span="4" :offset="index > 0 ? 0.5 : 1"> -->
      <el-col>
        <el-card :body-style="{ padding: '0px' }">
          <img :src="productList.preview_image_uri" class="image">
          <div style="padding: 14px;">
            <p>{{ productList.title }}</p>
            <p>{{ productList.brand_name }}</p>
            <div v-if="productList.display_discount_ratio !== 0">
              <p>{{ productList.display_discount_ratio }}%</p>
              <p>{{ productList.display_discounted_price }}</p>
              <p>{{ productList.origin_customer_price }}</p>
            </div>
            <div v-else>
              <p>{{ productList.display_discounted_price }}</p>
            </div>
            <div class="bottom clearfix">
              <a><el-button type="info" plain class="button">제품 상세보기</el-button></a>
              <!-- <el-button type="primary" plain class="button" @click="createLink()">바이럴 링크 생성</el-button> -->
              <el-button type="primary" plain class="button" @click="createLink()">바이럴 링크 생성</el-button>
              <el-dialog
                :visible.sync="viralCreateLink"
                title="바이럴 링크 생성"
                width="800px"
              >
                <create-link
                  :modal-info="productList"
                  :detail-info="guideInfo"
                />
              </el-dialog>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import { regularSale } from '@/api/regular-sale'
import CreateLink from '@/custom/modal/CreateLink'

export default {
  components: {
    CreateLink
  },
  props: {
    productList: {
      type: Array[Object],
      default: () => []
    },
    guideInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      viralCreateLink: false
    }
  },
  created() {

  },
  methods: {
    createLink() {
      this.$emit('guideWarning')
      this.viralCreateLink = true
    }
    // createLink() {
    //   this.viralCreateLink = true
    //   regularSale.getContract().then((res) => {
    //     console.log(res)
    //     // this.productList = res
    //   })
    // }
  }
}

</script>

<style lang="scss" scoped>
.aa {
  width: 200px;
  float: left;
}
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.image {
  width: 100%;
  display: block;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
