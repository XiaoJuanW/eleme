<template>
  <div class="cartcontrol">
    <div class="cart-derease" v-show="food.count > 0"></div>
    <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    <div class="cart-add"></div>
  </div>
</template>
<script>
  export default {
    props: {
      food: {
        type: Object
      }
    },
    created() {
      // console.log(this.food);
    }
  };
</script>
<style lang="stylus">

</style>
