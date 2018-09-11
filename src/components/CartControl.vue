<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-decrease" v-show="food.count> 0" @click="decreaseCart()">
        <span class="inner fa fa-minus-circle"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add fa fa-plus-circle" @click="addCart($event)"></div>
  </div>
</template>
<script>
import Vue from "vue";

export default {
	props: {
		food: {
			type: Object
		}
	},
	methods: {
		addCart(event) {
			if (!this.food.count) {
				// 本身不存在需要用set设置，否则无效
				Vue.set(this.food, "count", 1);
				this.food.count = 1;
			} else {
				this.food.count++;
      }
      // 提交'cart-add'事情给父组件，第二个是要传递的参数
      this.$emit('cart-add', event.target);
		},
		decreaseCart() {
			this.food.count--;
		}
	},
	created() {
		// console.log(this.food);
	}
};
</script>
<style lang="stylus">
.cartcontrol {
  font-size: 0; // 为了让标签之间没有间隙

  .cart-decrease {
    display: inline-block;
    padding: 6px; // 为了让点击区域变大而且展示不变形
    transition: all 0.4s linear;

    &.move-enter-active, &.move-leave-active {
      // 这个不写也可以，不知道为什么
      // opacity: 1;
      // transform: translate3d(0, 0, 0);
      .inner {
        transition: all 0.4s linear;
        transform: rotate(0);
      }
    }

    &.move-enter, &.move-leave-to {
      opacity: 0;
      transform: translate3d(24px, 0, 0);

      .inner {
        transition: all 0.4s linear;
        transform: rotate(180deg);
      }
    }

    .inner {
      display: inline-block;
      line-height: 24px;
      font-size: 24px; // 上面设置了0，这里需要设置回来
      color: rgb(0, 160, 220);
    }
  }

  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 12px;
    padding-top: 6px;
    line-height: 24px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px; // 为了让点击区域变大而且展示不变形
    line-height: 24px;
    font-size: 24px; // 上面设置了0，这里需要设置回来
    color: rgb(0, 160, 220);
  }
}
</style>
