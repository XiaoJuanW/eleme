<template>
  <div class="ratings" ref="ratingsWrapper">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品态度</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select :selectType="selectType" :only-content="onlyContent" :ratings="ratings"></rating-select>
      <div class="rating-wrapper">
        <ul>
          <li class="rating-item" v-show="ratingShow(rating)" v-for="rating in ratings">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <div class="name">{{rating.username}}</div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
              <div class="star-wrapper">
                <star class="star" :size="24" :score="rating.score"></star>
                <span v-show="rating.deliveryTime" class="deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p v-show="rating.text" class="text">{{rating.text}}</p>
              <div class="recommend">
                <span :class="{'fa fa-thumbs-up': rating.rateType === 0, 'fa fa-thumbs-down': rating.rateType === 1}"></span>
                <span class="item" v-for="item in rating.recommend">
                  {{item}}
                </span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import Star from "@/components/Star.vue";
import Split from "@/components/Split.vue";
import RatingSelect from "@/components/RatingSelect.vue";
import { formatDate } from "@/common/js/Date.js";
const ALL = 2;
const ERR_OK = 0;
export default {
	props: {
		seller: {
			type: Object
		}
	},
	data() {
		return {
			ratings: [],
			selectType: ALL,
			onlyContent: true
		};
	},
	components: {
		Star,
		Split,
		RatingSelect
	},
	filters: {
		formatDate(time) {
			let date = new Date(time);
			return formatDate(date, "yyyy-MM-dd hh:mm");
		}
	},
	methods: {
		_initScroll() {
			this.scroll = new BScroll(this.$refs.ratingsWrapper, {
				click: true
			});
		},
		ratingShow(rating) {
			if (this.onlyContent && !rating.text) {
				return false;
			}
			if (this.selectType === ALL) {
				return true;
			} else {
				return this.selectType === rating.rateType;
			}
		},
		ratingTypeSelect(el) {
			// 拿到子组件，并且拿到它的data
			this.selectType = el;
		},
		contentToggle(el) {
			this.onlyContent = el;
		}
	},
	created() {
		this.$http.get("/api/ratings").then(response => {
			if (response.body.errno === ERR_OK) {
				this.ratings = response.body.data;
				this.$nextTick(() => {
					this._initScroll();
				});
			}
		});
		this.$eventHub.$on("ratingtype-select", this.ratingTypeSelect);
		this.$eventHub.$on("content-toggle", this.contentToggle);
	},
	beforeDestroy() {
		this.$eventHub.$off("ratingtype-select", this.ratingTypeSelect);
		this.$eventHub.$off("content-toggle", this.contentToggle);
	}
};
</script>
<style lang="stylus">
.ratings {
  position: absolute;
  top: 174px;
  bottom: 0;
  width: 100%;
  overflow: hidden;

  .overview {
    display: flex;
    padding: 18px 0;

    .overview-left {
      flex: 0 0 137px;
      padding: 6px 0;
      width: 137px;
      text-align: center;
      border-right: 1px solid rgba(7, 17, 27, 0.1);

      // 适配小屏幕
      @media only screen and (max-width: 320px) {
        flex: 0 0 120px;
        width: 120px;
      }

      .score {
        margin-bottom: 6px;
        line-height: 28px;
        font-size: 24px;
        color: rgb(255, 153, 0);
      }

      .title {
        margin-bottom: 8px;
        line-height: 12px;
        font-size: 12px;
        color: rgb(7, 17, 27);
      }

      .rank {
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }

    .overview-right {
      flex: 1;
      padding: 6px 0 6px 24px;

      // 适配小屏幕
      @media only screen and (max-width: 320px) {
        padding-left: 6px;
      }

      .score-wrapper {
        line-height: 18px;
        margin-bottom: 8px;
        font-size: 0;

        .title {
          display: inline-block;
          vertical-align: top;
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }

        .star {
          display: inline-block;
          vertical-align: top;
          margin: 0 12px;
        }

        .score {
          display: inline-block;
          vertical-align: top;
          font-size: 12px;
          color: rgb(255, 153, 0);
        }
      }

      .delivery-wrapper {
        font-size: 0;

        .title {
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }

        .delivery {
          margin-left: 12px;
          line-height: 18px;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }

  .rating-wrapper {
    padding: 0 18px;

    .rating-item {
      display: flex;
      padding: 18px 0;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);

      .avatar {
        flex: 0 0 28px;
        margin-right: 12px;

        img {
          border-radius: 50%;
        }
      }

      .content {
        position: relative;
        flex: 1;

        .name {
          margin-bottom: 4px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(7, 17, 27);
        }

        .time {
          position: absolute;
          top: 0;
          right: 0;
          line-height: 12px;
          font-size: 10px;
          font-weight: 200;
          color: rgb(147, 153, 159);
        }

        .star-wrapper {
          margin-bottom: 6px;
          font-size: 0;

          .star {
            display: inline-block;
            margin-right: 6px;
          }

          .deliveryTime {
            line-height: 12px;
            font-size: 10px;
            font-weight: 200;
            color: rgb(147, 153, 159);
          }
        }

        .text {
          margin-bottom: 8px;
          line-height: 18px;
          font-size: 12px;
          color: rgb(7, 17, 27);
        }

        .recommend {
          line-height: 18px;
          font-size: 0;

          .fa-thumbs-up {
            display: inline-block;
            margin-right: 8px;
            font-size: 12px;
            color: rgb(0, 160, 220);
          }

          .fa-thumbs-down {
            display: inline-block;
            margin-right: 8px;
            font-size: 12px;
            color: rgb(183, 187, 197);
          }

          .item {
            display: inline-block;
            margin-right: 8px;
            padding: 0 6px;
            border-radius: 1px;
            font-size: 9px;
            color: rgb(147, 153, 159);
            border: 1px solid rgba(7, 17, 27, 0.1);
          }
        }
      }
    }
  }
}
</style>

