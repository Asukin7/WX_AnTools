<template>
  <div>

    <div class="flex bg-white">
      <div class="flex-sub text-center padding solid" @click="orderByDate()"><text :class="orderBy=='date'?'text-blue':''">时间<text class="cuIcon-order"></text></text></div>
      <div class="flex-sub text-center padding solid" @click="orderByMoney()"><text :class="orderBy=='money'?'text-blue':''">金额<text class="cuIcon-order"></text></text></div>
    </div>

    <div class="text-center text-grey" style="padding: 200rpx 0;" v-if="bookkeepingListView==null||bookkeepingListView.length==0">暂无数据</div>
    
    <div class="cu-list menu-avatar bg-white" style="margin:0rpx">
      <!-- 体 -->
      <div class="cu-item" :class="modalName=='move-box-'+index?'move-cur':''" v-for="(item,index) in bookkeepingListView" :key="index" @touchstart="listTouchStartFun($event)" @touchmove="listTouchMoveFun($event)" @touchend="listTouchEndFun($event)" :data-target="'move-box-'+index">
        <div class="cu-avatar round lg" :class="item.incomeOrExpend=='income'?'bg-orange':'bg-green'">
          <!-- 账单图标 -->
          <text :class="bkTypeTo[item.bkType].icon" style="font-size:x-large;"></text>
        </div>
        <div class="content flex-sub" @click="openBookkeepingEdit(item)">
          <div class="flex justify-between text-l">
            <div>
              <!-- 账单类型 -->
              <text>{{bkTypeTo[item.bkType].name}}</text>
            </div>
            <div>
              <!-- 账单金额 -->
              <text>{{item.incomeOrExpend=='income'?'+':'-'}} {{item.bkMoney}}</text>
            </div>
          </div>
          <div class="flex justify-between text-sm text-gray">
            <!-- 账单备注 -->
            <text class="text-cut">{{item.bkRemark==null?'':item.bkRemark}}</text>
            <!-- 账单日期 -->
            <text>{{item.bkDate}}</text>
          </div>
        </div>
        <div class="move">
          <view class="bg-red" @click="deleteBookkeeping(item)">删除</view>
        </div>
        <div :class="index==bookkeepingListView.length-1?'':'list_border'"/>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // 发送的数据
      incomeOrExpend: null,
      bkType: null,
      bkDateStr: null,
      // 接收的数据
      bookkeepingListAll: null,
      // 接收处理后的数据
      bookkeepingListView: null,
      // 工具数据
      order: null,
      orderBy: null,
      bkTypeTo: null,
      modalName: null
    }
  },

  onLoad: function (option) {
    this.bookkeepingListAll = null
    this.bookkeepingListView = null

    this.bkTypeTo = this.$bkTypeTo.bkTypeTo
    this.order = true
    this.orderBy = 'date'
    this.modalName = null

    this.incomeOrExpend = option.incomeOrExpend
    this.bkType = option.bkType
    this.bkDateStr = option.bkDateStr
  },

  onShow: function () {
    this.getBookkeepingData()
  },

  methods: {
    // 获取账单数据
    getBookkeepingData () {
      this.$wxRequest.post({
        url: 'bookkeeping/listAll',
        data: {
          'incomeOrExpend': this.incomeOrExpend,
          'bkType': this.bkType,
          'bkDateStr': this.bkDateStr
        },
        header: {'Authorization': this.globalData.token}
      })
        .then((res) => {
          this.bookkeepingListAll = res.data.bookkeepingListAll
          if (this.orderBy === 'date') {
            this.bookkeepingListView = this.getBookkeepingListOrderByDate()
            if (!this.order) {
              this.bookkeepingListView.reverse()
            }
          }
          if (this.orderBy === 'money') {
            this.bookkeepingListView = this.getBookkeepingListOrderByMoney()
            if (!this.order) {
              this.bookkeepingListView.reverse()
            }
          }
        })
    },
    // 按日期排序
    orderByDate () {
      if (this.orderBy === 'date') {
        this.order = !this.order
        this.bookkeepingListView.reverse()
      } else {
        this.order = true
        this.orderBy = 'date'
        this.bookkeepingListView = this.getBookkeepingListOrderByDate()
      }
    },
    // 按金额排序
    orderByMoney () {
      if (this.orderBy === 'money') {
        this.order = !this.order
        this.bookkeepingListView.reverse()
      } else {
        this.order = true
        this.orderBy = 'money'
        this.bookkeepingListView = this.getBookkeepingListOrderByMoney()
      }
    },
    // 删除账单数据
    deleteBookkeeping (data) {
      var that = this
      wx.showModal({
        title: '确认删除？',
        confirmColor: '#ff0000',
        success (res) {
          if (res.confirm) {
            that.$wxRequest.post({
              url: 'bookkeeping/delete',
              data: {
                'id': data.id
              },
              header: {'Authorization': that.globalData.token}
            })
              .then((res) => {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                })
                that.getBookkeepingData()
              })
          }
        }
      })
      this.modalName = null
    },
    // 打开编辑账单页面
    openBookkeepingEdit (data) {
      var str = '?id=0'
      if (data !== null) {
        str = '?id=' + data.id + '&incomeOrExpend=' + data.incomeOrExpend + '&bkMoney=' + data.bkMoney + '&bkType=' + data.bkType + '&bkRemark=' + (data.bkRemark === null ? '' : data.bkRemark) + '&bkDate=' + data.bkDate
      }
      wx.navigateTo({
        url: '../bookkeepingEdit/main' + str
      })
    },
    // 获取按日期排序的账单数组
    getBookkeepingListOrderByDate () {
      var tempList = []
      for (var i = 0; i < this.bookkeepingListAll.length; i++) {
        tempList.push(this.bookkeepingListAll[i])
      }
      return tempList
    },
    // 获取按金额排序的账单数组
    getBookkeepingListOrderByMoney () {
      var tempList = []
      for (var i = 0; i < this.bookkeepingListAll.length; i++) {
        tempList.push(this.bookkeepingListAll[i])
      }
      tempList.sort(function (a, b) {
        return b.bkMoney - a.bkMoney
      })
      return tempList
    },
    listTouchStartFun (e) {
      this.ListTouchStart = e.mp.changedTouches[0].pageX
    },
    listTouchMoveFun (e) {
      this.ListTouchDirection = e.mp.changedTouches[0].pageX - this.ListTouchStart > 0 ? 'right' : 'left'
      if (this.ListTouchDirection === 'left') {
        this.modalName = e.mp.currentTarget.dataset.target
      } else {
        this.modalName = null
      }
    },
    listTouchEndFun (e) {
      this.ListTouchDirection = null
    }
  }
}
</script>

<style>
  .list_border {
    position: fixed;
    width: 80%;
    border-bottom: 1px solid #f0f0f0;
    bottom: 1px;
  }
</style>
