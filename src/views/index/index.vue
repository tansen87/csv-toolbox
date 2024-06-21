<script setup lang="ts">
  import { ref } from 'vue';
  import { ElCarousel, ElCarouselItem, ElLink } from 'element-plus';

  const items = ref([
    {
      id: 1,
      title: 'github source',
      link: 'https://github.com/tansen87/csv-toolbox',
    },
    {
      id: 2,
      title: 'download new version',
      link: 'https://github.com/tansen87/csv-toolbox/releases',
    },
  ]);

  defineOptions({
    name: 'RtWelcome',
  });
</script>

<template>
  <el-scrollbar class="page-container">
    <div class="block text-center">
      <ElCarousel height="300px" motion-blur>
        <ElCarouselItem v-for="item in items" :key="item.id">
          <ElLink :href="item.link" target="_blank" class="carousel-item">
            <div class="carousel-item-title">{{ item.title }}</div>
          </ElLink>
        </ElCarouselItem>
      </ElCarousel>
    </div>
  </el-scrollbar>
</template>

<style scoped>
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n + 1) {
    background-color: #a9c9ea;
  }

  .carousel-item {
    display: block;
    width: 100%;
    height: 100%;
  }

  .carousel-item-title {
    display: block;
    width: 100%;
    height: 100%;
    color: #fff;
    line-height: 300px;
    text-align: center;

    /* background-color: rgba(0, 0, 0, 0.5); */
  }
</style>
