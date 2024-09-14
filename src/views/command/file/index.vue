<script setup lang="ts">
  import GetFileName from './components/GetFileName.vue';
</script>

<template>
  <el-scrollbar>
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
    </el-row>
  </el-scrollbar>
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
