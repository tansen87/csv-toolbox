<script setup lang="ts">
  import Data4mysql from './components/Data4mysql.vue';
  import Pivot from './components/Pivot.vue';
  import Unique from './components/Unique.vue';
  import Concat from './components/Concat.vue';
  import ConcatSpecific from './components/ConcatSpecific.vue';
  import Excel2csv from './components/Excel2csv.vue';
  import Csv2xlsx from './components/Csv2xlsx.vue';

  defineOptions({
    name: 'RtWelcome',
  });
</script>

<template>
  <div>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Download Data</span>
            </div>
          </template>
          <Data4mysql />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Pivot Data</span>
            </div>
          </template>
          <Pivot />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Concat</span>
            </div>
          </template>
          <Concat />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Concat Specific</span>
            </div>
          </template>
          <ConcatSpecific />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Excel to Csv</span>
            </div>
          </template>
          <Excel2csv />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Csv to xlsx</span>
            </div>
          </template>
          <Csv2xlsx />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>Unique</span>
            </div>
          </template>
          <Unique />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;

    :deep(.el-card__header) {
      padding-bottom: 0;
      border: none;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: 600;
    }

    .card-content {
      :deep(.el-progress-bar__outer) {
        height: 17px !important;
      }

      .numerical-value {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: 10px;

        .number {
          color: var(--text-color-primary);
          font-size: var(--font-size-extra-large);
          font-weight: 600;
        }
      }
    }
  }
</style>
