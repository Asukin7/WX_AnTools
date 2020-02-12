<template>
  <div>
    <div class="cu-card case margin-top">
      <div class="cu-item shadow">
        <scroll-view class="nav text-center margin-bottom">
          <div v-if="type=='expend'||type==null" class="cu-item isIncome?'':'text-blue cur'" bindtap="typeSelect0">
            支出
          </div>
          <div v-if="type=='income'||type==null" class="cu-item isIncome?'text-green cur':''" bindtap="typeSelect1">
            收入
          </div>
        </scroll-view>

        <div class="cu-form-group solid-bottom">    
          <view class="text-price" style="font-size:80rpx;padding-left:30rpx;padding-right:30rpx;"></view>
          <input style="font-size:60rpx;height:100%;" type="digit" bindinput="handleInputChange" data-modal='2' :value="bkMoney"/>
        </div>

        <div class="typeList margin">
          <div class="typeListItem">
            <div class="cu-avatar round bg-blue">
              <text class="cuIcon-sponsor"></text>
            </div>
            <div class="margin-top-xs text-xs text-black">
              文字
            </div>
          </div>
          <div class="typeListItem">
            <div class="cu-avatar round bg-grey">
              <text class="cuIcon-sponsorfill"></text>
            </div>
            <div class="margin-top-xs text-xs text-grey">
              一
            </div>
          </div>
          <div class="typeListItem">
            <div class="cu-avatar round bg-grey">
              <text class="cuIcon-home"></text>
            </div>
            <div class="margin-top-xs text-xs text-grey">
              一二
            </div>
          </div>
          <div class="typeListItem">
            <div class="cu-avatar round bg-grey">
              <text class="cuIcon-redpacket"></text>
            </div>
            <div class="margin-top-xs text-xs text-grey">
              一二三
            </div>
          </div>
          <div class="typeListItem">
            <div class="cu-avatar round bg-grey">
              <text class="cuIcon-recharge"></text>
            </div>
            <div class="margin-top-xs text-xs text-grey">
              一二三四
            </div>
          </div>
          <div class="typeListItem">
            <div class="cu-avatar round bg-grey">
              <text class="cuIcon-baby"></text>
            </div>
            <div class="margin-top-xs text-xs text-grey">
              一二三四五
            </div>
          </div>
          <div class="typeListItem">
            <div class="cu-avatar round bg-grey">
              <text class="cuIcon-clothes"></text>
            </div>
            <div class="margin-top-xs text-xs text-grey">
              一二三四五六
            </div>
          </div>
        </div>

        <div class="cu-form-group solid-top">
          <textarea bindinput="handleInputChange" :value="remarkText" data-modal='1' placeholder="备注"></textarea>
        </div>

        <picker class="bg-grey light text-right" mode="multiSelector" :value="dateTime" :range="dateTimeArray" @change="changeDateTime" @columnchange="changeDateTimeColumn">
          <div class="padding">{{bkDate}}<text class="cuIcon-triangledownfill"></text></div>
        </picker>
      </div>
    </div>
    
    <div class="padding" style="position:fixed;width:100%;bottom:30rpx;">
      <button class="cu-btn bg-blue" style="width:100%;height:80rpx" bindtap="postData">保存</button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      bkDate: null,
      dateTime: null,
      dateTimeArray: null
    }
  },

  onLoad: function () {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = this.$dateTimePicker.dateTimePicker('2019', new Date().getFullYear())
    // 精确到分的处理，将数组的秒去掉
    obj.dateTimeArray.pop()
    obj.dateTime.pop()

    this.dateTime = obj.dateTime
    this.dateTimeArray = obj.dateTimeArray
    this.transDate()
  },

  methods: {
    changeDateTime (e) {
      this.dateTime = e.mp.detail.value
      this.transDate()
    },
    changeDateTimeColumn (e) {
      var arr = this.dateTime
      var dateArr = this.dateTimeArray

      arr[e.mp.detail.column] = e.mp.detail.value
      dateArr[2] = this.$dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]])

      this.dateTime = arr
      this.dateTimeArray = dateArr
      this.transDate()
    },
    transDate () {
      var year = this.dateTimeArray[0][this.dateTime[0]]
      var month = this.dateTimeArray[1][this.dateTime[1]]
      var day = '01'
      if (this.dateTimeArray[2].length > this.dateTime[2]) {
        day = this.dateTimeArray[2][this.dateTime[2]]
      }
      var hour = this.dateTimeArray[3][this.dateTime[3]]
      var minute = this.dateTimeArray[4][this.dateTime[4]]
      this.bkDate = year + '-' + month + '-' + day + ' ' + hour + ':' + minute
    }
  }
}
</script>

<style>
  .typeList{
    display: flex;
    overflow-y: scroll;
    white-space: nowrap;
    padding-top: 10rpx;
    padding-bottom: 10rpx;
  }
  .typeList .typeListItem{
    align-items: center;
    text-align: center;
    flex: 0 0 120rpx;
    height: 100%;
  }
</style>
