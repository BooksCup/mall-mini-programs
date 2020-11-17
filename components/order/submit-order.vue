<template>
    <view class="submit-order">
        <div :class='ishide==1?"hide":""' class='foot safe-area-inset-bottom'>
            <div>
                <p class="yh-pay-ye">付款金额：￥{{total}}</p>
            </div>
            <p @tap="$emit('submit')">立即支付</p>
        </div>
    </view>
</template>


<script>
    /**
     * submit-order 订单提交组件
     */
    export default {
        name: 'submit-order',
        props: {
            ishide: {
                default: 0,
                type: Number
            },
            total: {
                default: 0,
                type: [Number, String]
            },
        }
    }
</script>

<style lang="less" scoped>
    .foot {
        height: 98rpx;
        width: 100%;
        font-size: 30rpx;
        color: #020202;
        border: 1px solid #eee;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 20;
        background-color: #fff;
        padding-left: 30rpx;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        box-sizing: border-box;

        &.hide {
            display: none;
        }

        .yh-pay-ye {
            font-size: 30rpx;
            font-weight: 600;
            color: #020202;
        }

        > p {
            width: 240rpx;
            background-color: #020202;
            color: #fff;
            line-height: 98rpx;
            text-align: center;
            margin-left: 30rpx;
        }
    }
</style>
