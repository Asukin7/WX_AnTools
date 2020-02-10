<template>
  <div>
    <div class="container bg-black">
      <text class="text-xl">{{month==null?'全部':month}}支出<text class="text-sl">{{sumExpendMoney==null?'0':sumExpendMoney}}</text>元</text>
      <text class="text-l">收入<text class="text-l">{{sumIncomeMoney==null?'0':sumIncomeMoney}}</text>元</text>
    </div>

    <view class="cu-bar search bg-white">
     <view class="search-form round">
        <text class="cuIcon-search"></text>
        <input type="text" placeholder="搜索" confirm-type="search" value="remarkText" bindinput="searchInput"/>
      </view>
      <view class="action">
        <picker mode="date" value="date" fields="month" start="2019-01" end="date" bindchange="DateChange">
          <view class="picker">
            {{bkDateStr}}<text class="cuIcon-triangledownfill"/>
          </view>
        </picker>
      </view>
    </view>

    <view class="bg-blue round shadow fixed-button" bindtap="openBookkeepingEdit">
      <text class="cuIcon-add lg"/>
    </view>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: '2020-02',
      bkDateStr: '2020-02'
    }
  },

  methods: {
    clickHello () {
      console.log('Hello bk!')
    }
  }
}
</script>

<style>
  .fixed-button {
    position: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    font-size: 150%;
    width: 100rpx;
    height: 100rpx;
    bottom: 50rpx;
    right: 50rpx;
  }
</style>
