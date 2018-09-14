<template>
  <div class="ratingselect">
    <div class="rating-type">
      <span @click="select(2, $event)" class="block positive" :class="{'active': currentType === 2}">{{desc.all}}
        <span class="count">{{ratings.length}}</span>
      </span>
      <span @click="select(0, $event)" class="block positive" :class="{'active': currentType === 0}">{{desc.positive}}
        <span class="count">{{positives.length}}</span>
      </span>
      <span @click="select(1, $event)" class="block negative" :class="{'active': currentType === 1}">{{desc.negative}}
        <span class="count">{{negatives.length}}</span>
      </span>
    </div>
    <div @click="toggleContent($event)" class="switch" :class="{'on': currentOnlyContent}">
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
		return {
      // vue 2.0不允许子组件修改父组件传来的props，用一个data接收
      currentType: this.selectType,
      currentOnlyContent: this.onlyContent
    };
  },
  computed: {
    positives() {
      return this.ratings.filter((rating) => {
        // 筛选出符合条件的数据
        return rating.type === POSITIVE;
      });
    },
    negatives() {
      return this.ratings.filter((rating) => {
        // 筛选出符合条件的数据
        return rating.type === NEGATIVE;
      });
    }
  },
  methods: {
    select(type, event) {
      this.currentType = type;
      // 告诉父组件type的变化
      this.$emit('ratingtype-select', type);
    },
    toggleContent() {
      this.currentOnlyContent = !this.currentOnlyContent;
      this.$emit('content-toggle', this.currentOnlyContent);
    }
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
