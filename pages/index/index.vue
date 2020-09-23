<template>
    <div>
        <toload v-if="guideList.length == 0"></toload>
        <div v-else class="relative">
            <div class="count-down-btn" @tap="countDown()">
                <span class="time">{{ time }}</span>
                秒后进入
            </div>
            <swiper class="swiper" circular="false" :autoplay="autoplay" indicator-dots="true" interval="1500">
                <swiper-item v-for="(item, index) in guideList" :key="index">
                    <image class="image" :src="item.image"></image>
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
                guideList: [],
                // 倒计时秒数设定
                time: 1,
                // 是否自动切换
                autoplay: true,
                clear: ''
            }
        },
        onLoad() {
            uni.getSystemInfo({
                success: res => {
                    this.$store.state.data_height = res.statusBarHeight;
                }
            });
            this.getGuideList()
        },
        methods: {
            countDown() {
                if (this.time == 1) {
                    uni.reLaunch({
                        url: '../tab/home'
                    });
                    clearInterval(this.clear);
                } else if (this.time > 1) {
                    this.time--;
                }
            },
            getGuideList: function() {
                let query = {
                    storeId: this.$common.STORE_ID,
                    storeType: this.$common.getStoreType()
                }
                this.$guide.getGuideList(query).then(res => {
                    this.guideList = res
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
