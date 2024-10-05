<script setup lang="ts">
  import { ref } from 'vue';
  import { ElCarousel, ElCarouselItem, ElLink } from 'element-plus';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const items = ref([
    {
      id: 1,
      title: 'github source',
      link: 'https://github.com/tansen87/csv-toolbox',
    },
    {
      id: 2,
      title: 'download latest version',
      link: 'https://github.com/tansen87/csv-toolbox/releases',
    },
  ]);

  function toCount() {
    router.push('/command/count');
  }

  function toFile() {
    router.push('/command/file');
  }

  function toRename() {
    router.push('/command/rename');
  }

  function toCat() {
    router.push('/command/cat');
  }

  function toSelect() {
    router.push('/command/select');
  }

  function toSearch() {
    router.push('/command/search');
  }

  function toPolars() {
    router.push('/command/polars');
  }

  function toConvert() {
    router.push('/command/convert');
  }
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
    <p />

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toCount">
          <span class="title-color">Count</span>
          <p class="description-color">Count the rows of CSV files.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toCount">
          <span class="title-color">Insert blank cols</span>
          <p class="description-color">Insert a column of empty values into csv file.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toCount">
          <span class="title-color">Insert fill cols</span>
          <p class="description-color">Insert up to four columns of values into csv file.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toFile">
          <span class="title-color">Get filename</span>
          <p class="description-color">Get the file name from the folder and write it to xlsx.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toRename">
          <span class="title-color">Rename</span>
          <p class="description-color">Rename the columns of a CSV.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toCat">
          <span class="title-color">Cat</span>
          <p class="description-color">Merge multiple CSV files into one xlsx file or csv file.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toConvert">
          <span class="title-color">Excel to csv</span>
          <p class="description-color">Quickly convert excel to csv.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toConvert">
          <span class="title-color">Csv to xlsx</span>
          <p class="description-color">Quickly convert csv to xlsx.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toSearch">
          <span class="title-color">Search</span>
          <p class="description-color"> Select fields only matching rows. </p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toSelect">
          <span class="title-color">Select</span>
          <p class="description-color">Select, re-order csv columns.</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card" shadow="hover" @click="toPolars">
          <span class="title-color">Polars</span>
          <p class="description-color">Data pivot and unique.</p>
        </el-card>
      </el-col>
    </el-row>
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
  }

  .box-card {
    margin-bottom: 20px;
  }

  .title-color {
    font-size: 30px;
    font-weight: bold;
  }

  .description-color {
    font-size: 15px;
  }
</style>
