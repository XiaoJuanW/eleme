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
        <div class="favorite">
          <span @click="toggleFavorite()" class="icon fa fa-heart" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
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
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picsWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">商家信息</h1>
        <ul v-if="seller.infos">
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import Star from "@/components/Star.vue";
import Split from "@/components/Split.vue";
import { saveToLocal, loadFromLocal } from "@/common/js/Store.js";
const ERR_OK = 0;
export default {
	components: {
		Star,
		Split
	},
	props: {
		seller: {}
	},
	data() {
		return {
			favorite: (() => {
				return loadFromLocal(this.seller.id, "favorite", false);
			})()
		};
	},
	methods: {
		toggleFavorite() {
			this.favorite = !this.favorite;
			saveToLocal(this.seller.id, "favorite", this.favorite);
		},
		_initScroll() {
			if (!this.scroll) {
				this.scroll = new BScroll(this.$refs.sellWrapper, {
					click: true
				});
			} else {
				this.scroll.refresh();
			}
		},
		_initPicsScroll() {
			if (this.seller.pics) {
				let picWidth = 120;
				let marginR = 6;
				let width = (picWidth + marginR) * this.seller.pics.length - marginR;
				this.$refs.picList.style.width = width + "px";
				if (!this.picsScroll) {
					this.picsScroll = new BScroll(this.$refs.picsWrapper, {
						scrollX: true,
						eventPassthrough: "vertical"
					});
				} else {
					this.picsScroll.refresh();
				}
			}
		}
	},
	watch: {
		seller() {
			this._initScroll();
			this._initPicsScroll();
		}
	},
	ready() {
		this._initScroll();
		this._initPicsScroll();
	},
	created() {
		this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
		// this.$nextTick(() => {
		// 	// 不要忘记this.
		// 	this._initScroll();
		// 	this._initPicsScroll();
		// });
	},
	computed: {
		favoriteText() {
			return this.favorite ? "已收藏" : "收藏";
		}
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
    position: relative;
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

    .favorite {
      position: absolute;
      width: 50px;
      top: 18px;
      right: 11px; // 50-36（已收藏三个字宽度）=14； 14/2=7  18-7=11
      text-align: center;

      .icon {
        display: block;
        margin-bottom: 4px;
        line-height: 20px;
        font-size: 20px;
        color: #d4d6d9;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        line-height: 10px;
        font-size: 10px;
        color: rgb(77, 85, 93);
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

  .pics {
    padding: 18px;

    .title {
      margin-bottom: 12px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;

      .pic-list {
        font-size: 0;

        .pic-item {
          display: inline-block;
          margin-right: 6px;

          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
  }

  .info {
    padding: 18px 18px 0 18px;

    .title {
      margin-bottom: 12px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }

    .info-item {
      padding: 16px 12px;
      line-height: 16px; // 字数太多折行的话中间有间隙
      font-size: 12px;
      font-weight: 200;
      color: rgb(7, 17, 27);
      border-top: 1px solid rgba(7, 17, 27, 0.1);
    }
  }
}
</style>

