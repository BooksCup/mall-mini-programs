<template>
    <!-- 规则弹窗 -->
    <view class="ruleModal" v-if="isShow" @touchmove.stop.prevent @click.stop="cancel()">
        <view class="ruleModal-content" @click.stop>
            <view class="ruleModal-content-header">
                {{ title }}
            </view>
            <scroll-view scroll-y="true" class="ruleModal-content-body">
                <rich-text :nodes="details"></rich-text>
            </scroll-view>
            <view class="ruleModal-content-footer">
                <view class="foobtn" @click.stop="cancel()">
                    <text>我知道了</text>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
    export default {
        name: 'ruleModal',
        props: ['value', 'title', 'details'],
        data () {
            return {
                isShow: false
            }
        },
        watch: {
            value (op) {
                this.isShow = op
            }
        },
        methods: {
            cancel () {
                this.$emit('click', false)
            }
        }
    }
</script>

<style scoped lang="less">
    .ruleModal {
        position: fixed;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;

        &-content {
            width: 520rpx;
            height: 720rpx;
            background-color: #FFFFFF;
            border-radius: 10rpx;
            display: flex;
            flex-direction: column;

            &-header {
                color: #020202;
                font-weight: bold;;
                font-size: 30rpx;
                text-align: center;
                padding-top: 39rpx;
                padding-bottom: 34rpx;
            }

            &-body {
                padding: 0rpx 29rpx;
                margin-bottom: 15rpx;
                font-size: 24rpx;
                color: #666666;
                flex: 1;
                overflow-y: scroll;
                box-sizing: border-box;
                word-wrap: break-word;
            }

            &-footer {
                display: flex;
                justify-content: center;
                margin-bottom: 40rpx;

                .foobtn {
                    width: 240rpx;
                    height: 70rpx;
                    border-radius: 8rpx;
                    border: 2rpx solid rgba(36, 36, 36, 1);
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    text {
                        color: #020202;
                        font-size: 30rpx;
                        font-weight: 500;
                    }
                }
            }
        }
    }
</style>
