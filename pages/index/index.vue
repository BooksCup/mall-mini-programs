<template>
    <div>
        <toload v-if="guiderList.length == 0"></toload>
        <div v-else class="relative">
            <div class="countDownBtn" @tap="countDown()">
                <span class="time">{{ time }}</span>
                秒后进入
            </div>
            <swiper class="swiper" circular="false" :autoplay="autoplay" indicator-dots="true" interval="1500">
                <swiper-item v-for="(item, index) in guiderList" :key="index">
                    <image class="image" :src="item.guideImage"></image>
                </swiper-item>
            </swiper>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title: 'index',
                // 轮播图
                guiderList: [],
                // 倒计时秒数设定
                time: 3,
                // 是否自动切换
                autoplay: true,
                clear: ''
            }
        },
        onLoad() {
            this.fetchGuideList()
        },
        methods: {
            countDown() {
                if (this.time == 1) {
                    clearInterval(this.clear);
                } else if (this.time > 1) {
                    this.time--;
                }
            },
            fetchGuideList: function() {
                let query = {
                    storeId: this.$common.STORE_ID,
                    storeType: this.$common.getStoreType()
                }
                this.$guide.fetchGuideList(query).then(res => {
                    this.guiderList = res
                    // 启动倒计时
                    this.clear = setInterval(this.countDown, 1000);
                })
            }
        }
    }
</script>

<style>
    @import url("../../static/css/index/index.css");
</style>
