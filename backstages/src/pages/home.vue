<template>
  <div class="img-box">
    <img :src="src" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      src:
        "https://img.meituan.net/phoenix/a8f3f229c7474402d0489ffc0092e92f665273.jpg@1980w_1080h"
    };
  }
};
</script>

<style lang="scss" scoped>
.img-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>