<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref([]);
  const tableData = ref([]);
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
    const countErrmsg: any = 'count error: ' + error;
    ElMessage.error(countErrmsg);
  });

  // count csv rows
  async function countData() {
    tableData.value = [];
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    ElMessage.info('waiting...');
    loading.value = true;
    let countrows: any = await invoke('countr', {
      path: data.filePath,
    });
    const vls = JSON.parse(JSON.stringify(countrows));

    // 过滤掉空行并填充tableData
    const nonEmptyRows = vls.filter((row: any) => row.trim() !== '');
    tableData.value = nonEmptyRows.map((row: any) => {
      const [fileName, rows] = row.split('|'); // 分割文件名和行数
      return { File: fileName, Rows: rows };
    });

    loading.value = false;
    ElMessage.success('count done.');
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
      <el-table-column prop="File" label="File" width="400"></el-table-column>
      <el-table-column prop="Rows" label="Rows" width="200"></el-table-column>
    </el-table>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg[0] }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
