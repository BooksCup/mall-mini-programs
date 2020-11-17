<template>
    <view class="choose-address">
        <!-- 收货方式：自提还是快递 -->
        <div class='afhalen_box' v-if='shop_status'>
            <div>
                收货方式
            </div>
            <div @tap="onSwitchChange" class="switch-box">
                <text>自提</text>
                <text>快递</text>
                <div :style="'transform: translateX('+translateX+'px);'" class="switch-item"></div>
            </div>
        </div>

        <!-- 选择自提后显示 -->
        <div class="receiving" v-if="!is_express &&shop_address.id > 0">
            <!-- 选择自提店铺 -->
            <div class="afhalen_box afhalen_shop" @tap="navTo('/pagesA/myStore/storeList?shop_id='+shop_id)">
                <text>{{shop_address.address}}</text>
            </div>

            <!-- 用户资料 -->
            <div class="afhalen_box yh-afhalen_box">
                <input class="yh-afhalen-inputa" type="text" :value="value.name" @input="onInputAddressName" />
                <input class="yh-afhalen-inputb" type="text" :value="value.tel" @input="onInputAddressTel" />
            </div>
        </div>
        <!--没有地址-->
        <div @tap="navTo('/pagesA/myStore/storeList?shop_id='+shop_id)" class='address_two yh-address_two' v-if="!is_express&&shop_address.id === 0">
            <span>请选择门店</span>
        </div>
        <!-- 选择快递后,显示地址 -->
        <div @tap="navTo('/pages/address/receivingAddress?state_manage=1&addre_id='+value.id)" class='address_one' v-if='is_express && address_status'>
            <div class="yh-one-box">
                <span class="yh-one-spana">{{value.name}}</span>
                <span class="yh-one-spanb">{{value.tel}}</span>
                <p>{{value.address_xq}}</p>
            </div>
            <img :src="jiantou" class='arrow' />
        </div>
        <!--没有地址-->
        <div @tap="navTo('/pages/address/addAddress?state_addre=1&addNum=0')" class='address_two' v-if='is_express&&!address_status'>
            <span>+</span>
            <span>点击添加地址</span>
        </div>
    </view>
</template>

<script>
    /**
     * choose-address 选择地址业务组件
     * @description 用于订单确认页选择门店和收货地址
     * @property {Boolean} shop_status 是否可以选择门店（默认false）
     * @property {Number | String} shop_id 门店id（默认 0）
     * @property {String | Number} size 开关尺寸，单位rpx（默认50）
     * @property {Object} shop_address 门店地址 
     * @property {Object} value 收货人地址
     * @property {Boolean } address_status 是否设置了默认地址（默认false）
     * @property {Boolean} is_express 是否使用快递方式配送（默认true）
     * @event {Function} change 在switch打开或关闭时触发
     * @event {Function} input 修改地址是触发
     * @example <choose-address
             :shop_address="shop_list"
             :shop_id="pro[0].shop_id"
             :shop_status="shop_status === 1"
             v-model="address"
             :address_status="adds_f"
             :is_express="is_express"
             @change="sChange"
             />

            pages/pay/orderDetailsr.vue
     */
    export default {
        name: 'choose-address',
        data() {
            return {
                jiantou: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/jiantou2x.png',
            }
        },
        props: {
            shop_status: {
                default: false,
                type: Boolean
            },
            // 操又是一个接口不规范
            shop_id: {
                default: 0,
                type: [Number, String]
            },
            // 有毒，接口返回为空的时候是个数组，有数据的时候是个对象
            shop_address: {
                default: {
                    address: '',
                    id: 0,
                    mobile: '',
                    name: ''
                },
                type: [Object, Array]
            },
            value: {
                default: {
                    name: '',
                    tel: '',
                    address_xq: '',
                    id: 0
                },
                type: Object
            },
            address_status: {
                default: false,
                type: Boolean
            },
            is_express: {
                default: true,
                type: Boolean
            }
        },
        computed: {
            translateX() {
                if (this.is_express) {
                    return 0
                }
                return 35
            }
        },
        methods: {
            onInputAddressName(e) {
                this.$emit('input', {
                    name: e.detail.value,
                    tel: this.value.tel,
                    address_xq: this.value.address_xq,
                    id: this.value.id
                })
            },
            onInputAddressTel(e) {
                this.$emit('input', {
                    name: this.value.name,
                    tel: e.detail.value,
                    address_xq: this.value.address_xq,
                    id: this.value.id
                })
            },
            onSwitchChange() {
                this.$emit('change', !this.is_express)
            }
        }
    }
</script>

<style lang="less" scoped>
    .choose-address {
        .afhalen_box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 30rpx;
            color: #020202;
            font-size: 28rpx;

            .switch-box {
                display: flex;
                justify-content: space-around;
                align-items: center;
                font-size: 24rpx;
                position: relative;
                width: 144rpx;
                height: 60rpx;
                border-radius: 30rpx;
                color: #fff;
                background-color: #4CD864;

                .switch-item {
                    position: absolute;
                    top: 2rpx;
                    left: 0;
                    width: 72rpx;
                    height: 56rpx;
                    border-radius: 28rpx;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: -1px 5px 5px 0px rgba(13, 4, 8, 0.15);
                    transition: transform .3s;
                }
            }

            input {
                height: 60rpx;
                font-size: 26rpx;
                color: #242424;
            }


        }

        .receiving {
            width: 100%;

            .afhalen_shop img {
                width: 15rpx;
                height: 27rpx;
            }

            .yh-afhalen_box {
                justify-content: flex-start;
                padding: 20rpx 30rpx;

                .yh-afhalen-inputa {
                    width: 130rpx;
                    text-overflow: ellipsis;
                }

                .yh-afhalen-inputb {
                    flex: 1;
                }
            }
        }

        .address_two {
            height: 90rpx;
            text-align: center;
            line-height: 90rpx;
            font-size: 30rpx;
            color: #888;

            &.yh-address_two {
                text-align: left;
                padding-left: 15px;
            }
        }

        .address_one {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            padding: 30rpx;
            font-size: 28rpx;
            color: #020202;

            .yh-one-box {
                width: 90%;

                .yh-one-spana {
                    margin-right: 30rpx;
                    font-weight: bold;
                }

                .yh-one-spanb {
                    font-weight: bold;
                }
            }

            p {
                font-size: 24rpx;
                color: #9D9D9D;
                margin-top: 20rpx;
            }

            .arrow {
                width: 16rpx;
                height: 28rpx;
                vertical-align: sub;
                position: relative;
            }
        }
    }
</style>
