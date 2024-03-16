<script setup lang="ts">
  import GetFileName from './components/GetFileName.vue';
  import Select from './components/Select.vue';
  import InsertBlank from './components/InsertBlank.vue';
  import InsertFill from './components/InsertFill.vue';

  defineOptions({
    name: 'RtWelcome',
  });
</script>

<template>
  <div>
    <el-row :gutter="24" class="enter-y">
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>get file name</span>
            </div>
          </template>
          <GetFileName />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>insert blank cols</span>
            </div>
          </template>
          <InsertBlank />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>insert fill cols</span>
            </div>
          </template>
          <InsertFill />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="enter-y">
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <el-card class="box-card">
          <template #header>
            <div class="card-header cursor">
              <span>select columns</span>
            </div>
          </template>
          <Select />
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
