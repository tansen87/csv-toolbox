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
      title: 'download latest version',
      link: 'https://github.com/tansen87/csv-toolbox/releases',
    },
  ]);
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

    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Components/Box</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>count rows</span>
            </div>
          </template>
          <span>Count the rows in a csv file.</span>
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>insert blank cols</span>
            </div>
          </template>
          <span>Insert a column of empty values into csv file.</span>
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>insert fill cols</span>
            </div>
          </template>
          <span>Insert up to four columns of values into csv file.</span>
        </el-card>
      </el-col>
    </el-row>
    <p />

    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Components/File</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>get file name</span>
            </div>
          </template>
          <span>Get the file name from the folder and write it to xlsx.</span>
        </el-card>
      </el-col>
    </el-row>
    <p />

    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Components/Rename</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Rename the columns of a CSV efficiently.</span>
        </el-card>
      </el-col>
    </el-row>
    <p />

    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Components/Cat Convert</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>concat</span>
            </div>
          </template>
          <span>Merge multiple CSV files into one xlsx file or csv file.</span>
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>concat specific</span>
            </div>
          </template>
          <span>Merge csv files for specified columns.</span>
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>excel to csv</span>
            </div>
          </template>
          <span>Quickly convert excel to csv.</span>
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>csv to xlsx</span>
            </div>
          </template>
          <span>Quickly convert csv to xlsx.</span>
        </el-card>
      </el-col>
    </el-row>
    <p />

    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Components/Select</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>filter rows</span>
            </div>
          </template>
          <span
            >Streaming queries for data in a column that is equal to and contains certain
            values.</span
          >
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>select columns</span>
            </div>
          </template>
          <span>Select, re-order csv columns.</span>
        </el-card>
      </el-col>
    </el-row>
    <p />

    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <span>Components/Polars</span>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>pivot</span>
            </div>
          </template>
          <span>Data pivot.</span>
        </el-card>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>unique</span>
            </div>
          </template>
          <span>Data unique.</span>
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
</style>
