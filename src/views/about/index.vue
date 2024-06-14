<script lang="ts" setup>
  import { reactive } from 'vue';
  import packagePath from '../../../package.json';
  import cargoPath from '../../../src-tauri/cargo.json';
  const pageInfo = reactive({ info: {}, backDependencies: {}, frontDependencies: {} });

  const toName = {
    info: 'project info',
    frontDependencies: 'front end',
    backDependencies: 'backend',
  };

  pageInfo.info = {
    author: packagePath.author.name,
    version: packagePath.version,
    github: packagePath.author.url,
    email: packagePath.author.email,
  };
  pageInfo.backDependencies = cargoPath.dependencies;
  pageInfo.frontDependencies = packagePath.dependencies;
</script>

<template>
  <div>
    <el-row v-for="(item, index) in pageInfo" :key="index" :gutter="30" class="enter-y">
      <el-col>
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>{{ toName[index] }}</span>
            </div>
          </template>
          <div class="descriptions">
            <el-descriptions
              class="margin-top"
              direction="horizontal"
              :column="2"
              size="default"
              border
            >
              <el-descriptions-item v-for="(i, cindex) in item" :key="cindex" min-width="200px">
                <template #label>
                  {{ cindex }}
                </template>
                <span>{{ i }}</span>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
  .box-card {
    margin-bottom: 20px;

    .margin-top :deep(.el-descriptions__body) {
      margin: 20px;
      background-color: #{--main-bg-color} !important;
    }
  }
</style>
