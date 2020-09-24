<template>
    <div>
        <toload v-if="guiderImg.length == 0"></toload>
        <div v-else class="relative">
            <div class="countDownBtn" @tap="countDown()">
                <span class="time">{{ time }}</span>
                秒后进入
            </div>
            <swiper class="swiper" circular="false" :autoplay="autoplay" indicator-dots="true" interval="1500">
                <swiper-item v-for="(item, index) in guiderImg" :key="index">
                    <image class="image" :src="item"></image>
                </swiper-item>
            </swiper>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title: 'hello nima hello',
                guiderImg: [
                    'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=975216563,2695721503&fm=111&gp=0.jpg',
                    'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2873130398,3180460360&fm=26&gp=0.jpg'
                ], // 轮播图
                time: 3, //倒计时秒数设定
                autoplay: true, //是否自动切换
                clear: ''
            }
        },
        onLoad() {
            this.clear = setInterval(this.countDown, 1000);
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
                    storeId: 1,
                    storeType: 1
                }
                this.$guide.fetchGuideList(query).then(response => {
                    console.log(response)
                })
            }
        }
    }
</script>

<style>
    @import url("../../static/css/index/index.css");
</style>
