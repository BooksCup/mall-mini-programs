<template>
    <div :style="'display:flex;height:'+BoxHeight">
        <!-- #ifndef MP-ALIPAY -->
        <div class='head' :class="{'head_w':ishead_w == '1', 'border':border == true}">
            <div :class="{'white':!navWhite}" :style="{height: halfWidth}"></div>
            <div class='header'>
                <div class="header-left" @tap='_back1' v-if="flag&&(!returnFlag)">
                    <img v-if="ishead_w == '1'" :src="back1">
                    <img v-else :src="back">
                </div>
                <img :src="bback" @tap='_back1' v-if="(!flag) && (!returnFlag)" class="header_img">
                <p class="header-title" :class="{'title_w':ishead_w == '1'}">{{title}}</p>
                <div class="header-right" v-if="rightText" @click="$emit('right-click')">
                    <div class="content">
                        <img :src="rightIcon" v-if="rightIcon" alt="">
                        <p>{{rightText}}</p>    
                    </div>
                </div>
                
            </div>
        </div>
        <!-- #endif -->
    </div>
</template>

<script>

    export default {
        data () {
            return {
                flag: true,
                bback: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/bback.png',
                back: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
                back1: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon1/back2x.png',
            }
        },
        computed: {
            BoxHeight () {
                var gru = uni.getStorageSync('data_height') ? uni.getStorageSync('data_height') : this.$store.state.data_height
                // #ifdef MP-TOUTIAO
                // const info = uni.getSystemInfoSync()
                // if(info.platform != 'ios'){
                // 	gru=0
                // }
                // #endif
                let height = 0
                // #ifndef MP-ALIPAY
                var heigh = parseInt(gru) + uni.upx2px(88)
                height = heigh && heigh > 0 ? heigh : uni.upx2px(88)
                // #endif

                // #ifdef MP
                heigh += 44
                // #endif
                
                
                return height + 'px'
            }
        },
        props: [
            'title', 'returnR', 'navWhite', 'returnFlag', 'border', 'ishead_w', 'rightText', 'rightIcon'
        ],

        methods: {
            _back1 () {
                this.flag = false
                switch (Number.parseInt(this.returnR)) {
                    case 1:
                        uni.navigateBack({
                            delta: 2
                        })
                        break
                    case 2:
                        uni.switchTab({
                            url: '/pages/tabBar/shoppingCart'
                        })
                        break
                    case 3:
                        uni.redirectTo({
                            url: '/pages/login/login.vue'
                        })
                        break
                    case 4:
                        uni.navigateBack({
                            delta: 3
                        })
                        break
                    case 5:
                        uni.redirectTo({
                            url: '/pages/order/myOrder'
                        })
                        break
                    case 6:
                        uni.switchTab({
                            url: '/pages/tabBar/home'
                        })
                        break
                    case 7:
                        uni.switchTab({
                            url: '/pages/tabBar/my'
                        })
                        break
                    case 8:
                        uni.switchTab({
                            url: '/pages/tabBar/my'
                        })
                        break
                    case 9:
                        uni.redirectTo({
                            url: '/pagesA/myStore/myStore'
                        })
                        break
                    case 10:
                        uni.redirectTo({
                            url: '/pagesA/distribution/distribution_center'
                        })
                        break
                    default:
                        if (getCurrentPages().length > 1) {
                            uni.navigateBack({
                                delta: 1
                            })
                        } else {
                            uni.switchTab({
                                url: '/pages/tabBar/home'
                            })
                        }
                }
                this.flag = true
            }
        }

    }
</script>

<style scoped lang="less">
    .border {
        border-bottom: none;
    }

    .head {
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        width: 100%;
        z-index: 9999;
        border-bottom: 1px solid #eee;

        &.head_w {
            background: transparent;
            border-bottom: 0;
        }

        
        .white {
            background: #FFFFFF;
        }

        .header {
            color: #fff;
            border: none;

            .header_img {
                top: 46rpx !important;
                left: 10rpx !important;
                width: 64rpx !important;
                height: 64rpx !important;
            }

            &-title {
                text-align: center;
                width: 100%;
                height: 100%;
                line-height: 88rpx;
                color: #020202;
                font-size: 32rpx;

                &.title_w {
                    color: #FFFFFF !important;
                }
            }

            &-left {
                height: 88rpx;
                width: 160rpx;
                position: absolute;
                z-index: 9999;

                img {
                    position: absolute;
                    top: 26rpx;
                    left: 20rpx;
                    width: 24rpx;
                    height: 36rpx;
                }
            }
            
            &-right {
                position: absolute;

                /*  #ifndef MP  */
                top: 0;
                /*  #endif  */

                /*  #ifdef MP  */
                background: #F6f6f6;
                /*  #endif  */
                
                line-height: 44px;
                color: #020202;
                font-size: 16px;
                display: flex;
                height: 88rpx;
                align-items: center;
                flex-direction: row-reverse;
                width: 100%;
                padding-right: 24rpx;
                img {
                    width: 30rpx;
                    height: 30rpx;
                    margin-right: 10rpx;
                }
                .content {
                    display: flex;
                    height: 100%;
                    align-items: center;
                }
            }
            
        }
    }
    
</style>
