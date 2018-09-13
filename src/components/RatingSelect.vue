<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span class="block positive" :class="{'active': selectType === 2}">{{desc.all}}
        <span class="count">1{{ratings.length}}</span>
      </span>
      <span class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}
        <span class="count">2{{ratings.length}}</span>
      </span>
      <span class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}
        <span class="count">3{{ratings.length}}</span>
      </span>
    </div>
    <div class="switch" :class="{'on': onlyContent}">
      <span class="icon fa fa-check-circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default {
	props: {
		ratings: {
			type: Array,
			default() {
				return [];
			}
		},
		selectType: {
			type: Number,
			default: ALL
		},
		onlyContent: {
			type: Boolean,
			default: false
		},
		desc: {
			type: Object,
			default() {
				return {
					all: "全部",
					positive: "满意",
					negative: "不满意"
				};
			}
		}
	},
	data() {
		return {};
	}
};
</script>
<style lang="stylus">
.ratingselect {
  .rating-type {
    padding: 18px 0;
    margin: 0 18px; // 因为下面有条灰色的线，所以上下左右不要全写在padding里
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    font-size: 0; // 消除span之间的间隙

    .block {
      display: inline-block;
      padding: 8px 12px;
      margin-right: 8px;
      line-height: 16px;
      border-radius: 2px;
      font-size: 12px;
      color: rgb(77, 85, 93);

      &.active {
        color: #fff;
      }

      .count {
        margin-left: 2px;
        font-size: 8px;
      }

      &.positive {
        background: rgba(0, 160, 220, 0.2);

        &.active {
          background: rgb(0, 160, 220);
        }
      }

      &.negative {
        background: rgba(77, 85, 93, 0.2);

        &.active {
          background: rgb(77, 85, 93);
        }
      }
    }
  }

  .switch {
    padding: 12px 18px;
    line-height: 24px;
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    font-size: 0;
    color: rgb(147, 153, 159);

    &.on {
      .icon {
        color: #008c50;
      }
    }

    .icon {
      display: inline-block;
      vertical-align: top;
      margin-right: 4px;
      font-size: 24px;
    }

    .text {
      font-size: 12px;
    }
  }
}
</style>
