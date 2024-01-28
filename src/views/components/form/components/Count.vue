<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref([]);
  const tableData = ref([]);
  const title = ref([]);
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sep: '|',
  });

  listen('countErr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error);
  });

  // count csv rows
  async function countData(this: any) {
    title.value = [];
    tableData.value = [];
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      let counntrows: any = await invoke('countr', {
        path: data.filePath,
      });
      const vls = JSON.parse(JSON.stringify(counntrows));
      const vlsp = vls.map((item: any) => item.split('|'));
      tableData.value = vlsp.map((item: any) => ({
        File: item[0],
        Rows: item[1],
      }));
      for (const key in tableData.value[0]) {
        title.value.push(key as never);
      }
      tableData.value.forEach((item) => {
        let obj: any = {};
        title.value.forEach((item2: any, index2: any) => {
          // console.log('item', item[item2]);
          obj['in' + index2] = item[item2];
        });
        tableData.value.push(obj as never);
      });
      loading.value = false;
      ElMessage.success('count successfully.');
    }
  }

  async function selectFile() {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: 'csv',
          extensions: data.fileFormats,
        },
      ],
    });
    if (Array.isArray(selected)) {
      data.filePath = selected.toString();
    } else if (selected === null) {
      return;
    } else {
      data.filePath = selected;
    }
    getCSVMsg.value = selected as never;
  }
</script>

<template>
  <el-form v-loading="loading" element-loading-text="Counting..." :model="form">
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="countData()">Count</el-button>
    </el-form-item>
    <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column
        v-for="(item, index) in title"
        :key="index"
        :prop="'in' + index"
        :label="item"
        width="400"
      />
    </el-table>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg[0] }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
