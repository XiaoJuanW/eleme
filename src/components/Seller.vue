<template>
  <div class="seller" ref="sellWrapper">
    <div class="sell-content">
      <div class="overview">
        <h1 class="name">{{seller.name}}</h1>
        <div class="desc">
          <star class="star" :size="36" :score="seller.score"></star>
          <span class="rating-count">({{seller.ratingCount}})</span>
          <span class="sell-count">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <p class="content">{{seller.bulletin}}</p>
        <ul v-if="seller.supports" class="supports">
          <li class="support-item" v-for="item in seller.supports">
            <span class="icon" :class="classMap[item.type]"></span>
            <span class="text">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import Star from "@/components/Star.vue";
import Split from "@/components/Split.vue";

const ERR_OK = 0;
export default {
	components: {
		Star,
		Split
	},
	data() {
		return {
			seller: {}
		};
	},
	methods: {
		_initScroll() {
			if (!this.scroll) {
				this.scroll = new BScroll(this.$refs.sellWrapper, {});
			} else {
				this.scroll.refresh();
			}
		}
	},
	created() {
		this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
		this.$http.get("/api/seller").then(res => {
			res = res.body;
			if (res.errno === ERR_OK) {
				this.seller = res.data;
				this.$nextTick(() => {
          // 不要忘记this.
					this._initScroll();
				});
			}
		});
	}
};
</script>
<style lang="stylus">
bg-image($url) {
  background-image: url('../../static/' + $url + '@2x.png');

  @media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
    background-image: url('../../static/' + $url + '@3x.png');
  }
}

.seller {
  position: absolute;
  top: 174px;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    padding: 18px;

    .name {
      line-height: 14px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .desc {
      padding: 8px 0 18px 0;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      font-size: 0;

      .star, .rating-count, .sell-count {
        display: inline-block;
        vertical-align: top;
        line-height: 18px;
        font-size: 10px;
      }

      .star {
        margin-right: 8px;
      }

      .rating-count {
        margin-right: 12px;
        color: rgb(77, 85, 93);
      }

      .sell-count {
        color: rgb(77, 85, 93);
      }
    }

    .remark {
      display: flex;
      padding-top: 18px;
      text-align: center;

      .block {
        flex: 1;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border-right: none;
        }

        h2 {
          margin-bottom: 4px;
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .content {
          line-height: 24px;
          font-size: 10px;
          font-weight: 200;
          color: rgb(7, 17, 27);

          .stress {
            font-size: 24px;
          }
        }
      }
    }
  }

  .bulletin {
    padding: 18px 18px 0 18px;

    .title {
      margin-bottom: 8px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .content {
      padding: 0 12px 16px 12px;
      line-height: 24px;
      font-size: 12px;
      font-weight: 200;
      color: rgb(240, 20, 20);
    }

    .supports {
      .support-item {
        padding: 16px 12px;
        border-top: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 0;

        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          vertical-align: top;
          margin-right: 6px;
          background-size: 16px 16px;
          background-repeat: no-repeat;

          &.decrease {
            bg-image('decrease_4');
          }

          &.discount {
            bg-image('discount_4');
          }

          &.guarantee {
            bg-image('guarantee_4');
          }

          &.invoice {
            bg-image('invoice_4');
          }

          &.special {
            bg-image('special_4');
          }
        }

        .text {
          line-height: 16px;
          font-weight: 200;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }
      }
    }
  }
}
</style>

