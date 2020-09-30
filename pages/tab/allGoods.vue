<template>
    <div class="order_ii">
        <heads title="全部分类" bgHei="true" navWhite="true" returnFlag="1" />
        <div class="order_container skeleton">
            <div class="allgoods_b" :style="{ paddingBottom: h5Height }">
                <!-- 左边的列表 -->
                <ul class="allgoods_left" ref="allgoods_left" v-if="load">
                    <li v-for="(item, index) in centre_title" :class="{ color: title_index == index }" :key="index" class="allgoods_l" @tap="_title(index)">
                        <div>{{ item.cate_name }}</div>
                        <div :class="{ isborder: title_index == index }"></div>
                    </li>
                </ul>
                <ul class="allgoods_left" ref="allgoods_left" v-else>
                    <li  class="allgoods_l" v-for="(item, index) of 5" :key="index">
                        <div class="skeleton-rect" style="width: 100%;height: 26px">{{item}}</div>
                    </li>
                    
                </ul>
                <!-- 右边的详细分类 -->
                <div class="allgoods_right" v-if="load">
                    <ul class="allgoods_u" v-if="centre_list.length > 0">
                        <li @tap="_goods(items.child_id, items.name)" v-for="(items, index) in centre_list" :key="index">
                            <image style="width: 120rpx;height: 120rpx;" lazy-load="true" :src="items.picture" />
                            <p>{{ items.name }}</p>
                        </li>
                    </ul>
                    <div v-else>
                        <div><img class="noFindImg" style="margin-top: 100px;" :src="noOrder" /></div>
                        <span class="noFindText">暂时还没有二级分类哦</span>
                    </div>
                </div>
                <div class="allgoods_right" v-else>
                    <ul class="allgoods_u">
                        <li style="display:flex;flex-direction: column;justify-content:center;align-items:center;" v-for="(item, index) of 6" :key="index">
                            <div style="width: 60px;height: 60px;" class="skeleton-circle"></div>
                            
                            <p class="skeleton-rect" style="width: 50px;margin-top: 20px;">{{item}}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <skeleton :loading="!load" :animation="true" bgColor="#FFF"></skeleton>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
    data() {
        return {
            loadGif: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/loading.gif',
            noOrder: this.LaiKeTuiCommon.LKT_ROOT_VERSION_URL + 'images/icon/fenlei.png',
            title_index: 0, //商品导航切换
            centre_title: '', //左侧分类标题
            centre_list: '', //右侧详细分类
            cid: '', //分类id
            load: false,
            cc: 0, //导航下标
            skeleton_left: [
                
            ]
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
        this.LaiKeTuiCommon.getUrlFirst(this._axios);
        this.storag = uni.getStorageSync('history');
    },
    onshow() {
        this.cc = this.$store.state.cindex;
    },
    methods: {
        _axios() {
            var data = {
                
                module: 'app',
                action: 'search',
                app: 'index'
            };
            
            this.$req.post({data}).then(res=>{
                let {
                    List
                } = res;
                this.centre_title = List;
                this.centre_list = List[0];
                this.cc = this.$store.state.cindex;
                this._title(this.cc);
                this.load = true;
            })
            
        },
        /*   商品导航切换    */
        _title(index) {
            this.title_index = index;
            this.centre_list = this.centre_title[index].children;
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
@import url('../../static/css/tab/allGoods.css');
</style>
