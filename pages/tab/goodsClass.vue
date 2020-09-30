<template>
    <div class="goods-class-main">
        <heads title="全部分类" bgHei="true" navWhite="true" returnFlag="1" />
        <div class="goods-class-container skeleton">
            <div class="goods-class-wrapper" :style="{ paddingBottom: h5Height }">
                <!-- 左边(一级分类) -->
                <ul class="goods-class-left-item" ref="goods-class-left" v-if="load">
                    <li v-for="(item, index) in goods_class_list" :class="{ color: goods_class_index == index }" :key="index"
                        class="goods-class-left-title" @tap="_title(index)">
                        <div>{{ item.name }}</div>
                        <div :class="{ isborder: goods_class_index == index }"></div>
                    </li>
                </ul>
                <!-- 右边(二级分类) -->
                <div class="goods-class-right-wrapper" v-if="load">
                    <ul class="goods-class-right-item" v-if="sub_goods_class_list.length > 0">
                        <li @tap="_goods(items.child_id, items.name)" v-for="(items, index) in sub_goods_class_list"
                            :key="index">
                            <image style="width: 120rpx;height: 120rpx;" lazy-load="true" :src="items.picture" />
                            <p>{{ items.name }}</p>
                        </li>
                    </ul>
                    <div v-else>
                        <div><img class="noFindImg" style="margin-top: 100px;" :src="noOrder" /></div>
                        <span class="noFindText">暂时还没有二级分类哦</span>
                    </div>
                </div>
            </div>
        </div>

        <skeleton :loading="!load" :animation="true" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
    import {
        mapMutations
    } from 'vuex';

    export default {
        data() {
            return {
                loadGif: this.$common.ROOT_URL + '/static/images/icon/loading.gif',
                // 左侧导航切换
                goods_class_index: 0,
                // 左侧一级标题
                goods_class_list: [],
                // 右侧二级分类
                sub_goods_class_list: [],
                cid: '', //分类id
                load: false,
                cc: 0, //导航下标
                skeleton_left: []
            };
        },
        computed: {
            h5Height: function() {
                var height = 100;
                // #ifndef H5
                height = 0;
                // #endif
                return uni.upx2px(height) + 'px';
            }
        },
        onLoad(option) {
            this.getGoodsClassList();
            this.storag = uni.getStorageSync('history');
        },
        onshow() {
            this.cc = this.$store.state.cindex;
        },
        methods: {
            getGoodsClassList: function() {
                let query = {
                    storeId: this.$common.STORE_ID,
                }
                this.$goodsClass.getGoodsClassList(query).then(res => {
                    this.goods_class_list = res;
                    this.sub_goods_class_list = res[0].subGoodsClassList;
                    // this.cc = this.$store.state.cindex;
                    // this._title(this.cc);
                    this.load = true;
                })
            },

            /*   商品导航切换    */
            _title(index) {
                this.goods_class_index = index;
                this.sub_goods_class_list = this.goods_class_list[index].subGoodsClassList;
                this.cindex(index);
            },
            /*   跳转商品展示页面    */
            _goods(id, name) {
                uni.navigateTo({
                    url: '/pages/goods/goods?cid=' + id + '&name=' + name
                });
            },
            ...mapMutations({
                cindex: 'SET_CINDEX'
            })
        }
    };
</script>

<style scoped>
    @import url('../../static/css/tab/goodsClass.css');
</style>
