<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div class="back" @click="hide()">
            <i class="fa fa-angle-left"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellcount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class=" now ">￥{{food.price}}</span>
            <span class="old " v-show="food.oldPrice ">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="affFirstFood()" class="buy" v-show="!food.count || food.count === 0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
        </div>
        <!-- 绑定ref拿到子组件 -->
        <rating-select ref="ratingType" v-on:content-toggle="contentToggle" v-on:ratingtype-select="ratingTypeSelecy" :selectType="this.selectType" :only-content="this.onlyContent" :desc="this.desc" :ratings="food.ratings"></rating-select>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from "vue";
import BScroll from "better-scroll";
import CartControl from "@/components/CartControl.vue";
import Split from "@/components/Split.vue";
import RatingSelect from "@/components/RatingSelect.vue";

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
	props: {
		food: {
			type: Object
		}
	},
	components: {
		CartControl,
		Split,
		RatingSelect
	},
	data() {
		return {
			showFlag: false,
			selectType: ALL,
			onlyContent: true,
			desc: {
				all: "全部",
				positive: "推荐",
				negative: "吐槽"
			}
		};
	},
	methods: {
		// 一般私有方法_***，加下划线；可以被外部调用不用下划线
		show() {
			this.showFlag = true;

			// 可能在很多地方使用，show的时候初始化保证初始状态
			this.selectType = ALL;
			this.onlyContent = true;

			this.$nextTick(() => {
				if (!this.scroll) {
					this.scroll = new BScroll(this.$refs.food, {
						click: true
					});
				}
			});
		},
		hide() {
			this.showFlag = false;
		},
		affFirstFood() {
			// 提交'cart-add'事情给父组件，第二个是要传递的参数
			this.$emit("cart-add", event.target);
			Vue.set(this.food, "count", 1);
    },
    ratingTypeSelecy() {
      // 拿到子组件，并且拿到它的data
      console.log(this.$refs['ratingType'].currentType);
    },
    contentToggle() {
      console.log(this.$refs['ratingType'].currentOnlyContent);
    }
	}
};
</script>
<style lang="stylus">
.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 48px;
  z-index: 30px; // 小于ShopCart组件中list-mask的z-index
  width: 100%;
  background: #fff;
  transition: all 0.2s linear;

  &.move-enter-active, &.move-leave-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }

  &.move-enter, &.move-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%; // 设置成100%就是根据宽度计算的

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .back {
      position: absolute;
      top: 10px;
      left: 20px;
      font-size: 30px;
      color: white;
      padding: 10px;
    }
  }

  .content {
    position: relative;
    padding: 18px;

    .title {
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }

    .detail {
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;

      .sell-count, .rating {
        font-size: 10px;
        color: rgb(147, 153, 159);
      }

      .sell-count {
        margin-right: 12px;
      }
    }

    .price {
      font-weight: 700;
      line-height: 24px;

      .now {
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }

      .old {
        text-decoration: line-through;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }

    .cartcontrol-wrapper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }

    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 10px;
      font-size: 10px;
      color: rgb(255, 255, 255);
      background: rgb(0, 160, 255);
      // 加这个动画是因为，点击后display直接为none。
      // 那么在小球动画的时候找不到el元素，所以小球抛出的起点会不对
      // 加上动画有个延缓的效果
      transition: all 0.2s;

      &.fade-enter-active, &.fade-leave-active {
        opacity: 1;
      }

      &.fade-enter, &.fade-leave-to {
        opacity: 0;
      }
    }
  }

  .info {
    padding: 18px;

    .title {
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .text {
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }

  .rating {
    padding-top: 18px;

    .title {
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
  }
}
</style>


