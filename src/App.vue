<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- seller需要在这里传给Goods组件，Goods组件才能继续向下传递 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
const ERR_OK = 0;
export default {
	name: "App",
	data() {
		return {
			seller: {}
		};
	},
	components: {
		"v-header": Header
	},
	created() {
		this.$http.get("/api/seller").then(response => {
			if (response.body.errno === ERR_OK) {
				this.seller = response.body.data;
			}
		});
	}
};
</script>

<style lang="stylus">
@import url('common/css/reset.styl');
@import url('common/css/icon.styl');

border-1px($color) {
  position: relative;

  &:after {
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid $color;
    content: ' ';
  }
}

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  // border-bottom: 1px solid rgba(7, 17, 27, 0.1)
  border-1px(rgba(7, 17, 27, 0.1));

  .tab-item {
    flex: 1;
    text-align: center;

    &>a {
      display: block;
      font-size: 14px;
      color: rgb(77, 85, 93);

      &.active {
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style>
