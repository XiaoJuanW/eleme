<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList()">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalPrice > 0}">
              <i class="fa fa-shopping-cart" :class="{highlight: totalPrice > 0}"></i>
            </div>
            <div v-show="totalCount > 0" class="num">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalPrice > 0}">¥{{totalPrice}}</div>
          <div class="desc">¥另需配送费{{deliveryPrice}}元</div>
        </div>
        <!-- 阻止事件冒泡+提交事件不再重载页面 -->
        <div class="content-right" @click.stop.prevent="pay()">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
      </div>
      <div class="ball-container" v-for="ball in balls">
        <transition name="drop" v-on:before-enter="beforeDrop" v-on:enter="dropping" v-on:after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-show="listShow">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty()">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price * food.count}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList()"></div>
    </transition>
  </div>
</template>
<script>
import CartControl from "@/components/CartControl.vue";
import BScroll from "better-scroll";

export default {
	components: {
		CartControl
	},
	props: {
		selectFoods: {
			type: Array, // 如果是array或obj， default需要是函数
			default() {
				return [
					{
						price: 10,
						count: 1
					}
				];
			}
		},
		deliveryPrice: {
			tytype: Object,
			default: 0
		},
		minPrice: {
			tytype: Object,
			default: 0
		}
	},
	data() {
		return {
			//维护每个小球的状态,因为transition只对v-if  v-show  v-for有过渡效果
			//所以这里定义了show，在<template>中采用v-show指令
			balls: [
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				},
				{
					show: false
				}
			],
			dropBalls: [], // 下落小球数组
			fold: true // 是否折叠
		};
	},
	computed: {
		totalPrice() {
			let total = 0;
			this.selectFoods.forEach(food => {
				total += food.price * food.count;
			});
			return total;
		},
		totalCount() {
			let count = 0;
			this.selectFoods.forEach(food => {
				count += food.count;
			});
			return count;
		},
		payDesc() {
			if (this.totalPrice === 0) {
				// ``ES6语法
				return `¥${this.minPrice}元起送`;
			} else if (this.totalPrice < this.minPrice) {
				let diff = this.minPrice - this.totalPrice;
				return `还差¥${diff}元起送`;
			} else {
				return "去结算";
			}
		},
		payClass() {
			if (this.totalPrice >= this.minPrice) {
				return "enough";
			} else {
				return "bot-enough";
			}
		},
		listShow() {
			if (!this.totalCount) {
				this.fold = true;
				return false;
			}
			// 如果不折叠就需要展示，如果折叠就不显示
			let show = !this.fold;
			if (show) {
				this.$nextTick(() => {
					if (!this.scroll) {
						this.scroll = new BScroll(this.$refs.listContent, {
							click: true
						});
					} else {
						this.scroll.refresh();
					}
				});
			}
			return show;
		}
	},
	methods: {
		// 掉落方法
		drop(el) {
			// console.log(el);
			//对球进行遍历
			let len = this.balls.length;
			for (let i = 0; i < len; i++) {
				let ball = this.balls[i];
				if (!ball.show) {
					ball.show = true;
					ball.el = el;
					this.dropBalls.push(ball); //将下落的小球放进来
					return;
				}
			}
		},
		beforeDrop(el) {
			//将所有设为true的小球找到
			// 遍历所有的小球
			let count = this.balls.length;
			while (count--) {
				let ball = this.balls[count];
				if (ball.show) {
					//返回元素的大小及其相对于视口的位置的对象
					let rect = ball.el.getBoundingClientRect();
					//水平和竖直方向的偏移量
					let x = rect.left - 52; //左下角购物车和右侧点击的“+”的水平距离
					let y = -(window.innerHeight - rect.top - 52); //竖直方向的距离差
					//外层做一个纵向的变化
					el.style.display = "";
					el.style.webkitTransform = `translate3d(0,${y}px,0)`;
					el.style.transform = `translate3d(0,${y}px,0)`;
					//内层做一个横向的变化
					let inner = el.getElementsByClassName("inner-hook")[0]; //取到的是一个数组，所以要取第一个元素
					inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
					inner.style.transform = `translate3d(${x}px,0,0)`;
				}
			}
		},
		dropping(el, done) {
			let rf = el.offsetHeight;
			this.$nextTick(() => {
				//当下降的时候，重写外部和内部的translate3d()
				el.style.webkitTransform = "translate3d(0,0,0)";
				el.style.transform = "translate3d(0,0,0)";
				let inner = el.getElementsByClassName("inner-hook")[0]; //取到的是一个数组，所以要取第一个元素
				inner.style.webkitTransform = "translate3d(0,0,0)";
				inner.style.transform = "translate3d(0,0,0)";
				el.addEventListener("transitionend", done);
			});
		},
		afterDrop(el) {
			//当降落完一个ball，就将该ball从balls数组中取出来
			let ball = this.dropBalls.shift();
			if (ball) {
				ball.show = false;
				el.style.display = "none";
			}
		},
		toggleList() {
			if (!this.totalCount) {
				return;
			}
			this.fold = !this.fold;
		},
		empty() {
      // wrong: this.selectFoods = [];    为什么不能这样写
			this.selectFoods.forEach(food => {
				food.count = 0;
			});
    },
    hideList() {
      this.fold = true;
    },
    pay() {
      if(this.totalPrice < this.minPrice) {
        return;
      }
      window.alert(`支付${this.totalPrice}元`);
    }
	}
};
</script>
<style lang="stylus">
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 48px;

  .content {
    display: flex;
    background: #141d27;
    font-size: 0;
    color: rgba(255, 255, 255, 0.4);

    .content-left {
      flex: 1;

      .logo-wrapper {
        display: inline-block;
        vertical-align: top;
        position: relative;
        top: -10px;
        margin: 0 12px;
        padding: 6px;
        width: 56px;
        height: 56px;
        box-sizing: border-box;
        border-radius: 50%;
        background: #141d27;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          text-align: center;
          background: #2b343c;

          &.highlight {
            background: rgb(0, 160, 220);
          }

          .fa-shopping-cart {
            line-height: 44px;
            font-size: 24px;
            color: #80858a;

            &.highlight {
              color: #fff;
            }
          }
        }

        .num {
          position: absolute;
          top: 0;
          right: 0;
          width: 24px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border-radius: 16px;
          font-size: 9px;
          font-weight: 700;
          color: #fff;
          background: rgb(240, 20, 20);
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 12px;
        line-height: 24px;
        padding-right: 12px;
        box-sizing: border-box;
        border-right: 1px soloid rgba(255, 255, 255, 0.1);
        font-size: 16px;
        font-weight: 700;

        &.highlight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 12px 0 0 12px;
        line-height: 24px;
        font-size: 10px;
      }
    }

    .content-right {
      flex: 0 0 105px;
      width: 105px;

      .pay {
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-size: 12px;
        font-weight: 700;
        background: #2b333b;

        &.not-enough {
          background: #2b333b;
          color: rgba(255, 255, 255, 0.4);
        }

        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 64px;
      bottom: 44px;
      z-index: 200;
      // y轴 贝塞尔曲线
      transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

      .inner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: rgb(0, 160, 220);
        transition: all 0.4s linear; // x轴只需要线性缓动
      }
    }
  }

  .shopcart-list {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    width: 100%;
    transform: translate3d(0, -100%, 0);

    &.fold-enter-active, &.fold-leave-active {
      transition: all 0.5s;
    }

    &.fold-enter, &.fold-leave-to {
      transform: translate3d(0, 0, 0);
    }

    .list-header {
      height: 40px;
      line-height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .title {
        float: left;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .list-content {
      padding: 0 18px;
      max-height: 217px;
      overflow: hidden;
      background: #fff;

      .food {
        position: relative;
        padding: 12px 0;
        box-sizing: border-box;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);

        .name {
          line-height: 24px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .price {
          position: absolute;
          right: 90px;
          bottom: 10px;
          line-height: 24px;
          font-size: 14px;
          font-weight: 700;
          color: rgb(240, 20, 20);
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 5px;
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40; // 小于shopcart的z-index
  opacity: 1;
  background: rgba(7, 17, 27, 0.6);

  &.fade-enter-active, &.fade-leave-active {
    transition: all 0.5s;
  }

  &.fade-enter, &.fade-leave-to {
    opacity: 0;
    background rgba(7, 17, 27, 0);
  }
}
</style>

