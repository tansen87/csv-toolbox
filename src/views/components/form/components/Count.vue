<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const tableData = ref([]);
  const selectedFiles = ref([]);
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

  listen('cntmsg', (event: any) => {
    const cntmsg: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === cntmsg.split('|')[0]) {
        file.status = cntmsg.split('|')[1];
      }
    });
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
      sep: form.sep,
    });

    const vls = JSON.parse(JSON.stringify(countrows));
    const nonEmptyRows = vls.filter((row: any) => row.trim() !== '');
    tableData.value = nonEmptyRows.map((row: any) => {
      const [fileName, rows] = row.split('|');
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
      const nonEmptyRows = selected.filter((row: any) => row.trim() !== '');
      selectedFiles.value = nonEmptyRows.map((file: any) => {
        return { filename: file, status: '' };
      });
    } else if (selected === null) {
      return;
    } else {
      data.filePath = selected;
    }
  }
</script>

<template>
  <el-form :model="form">
    <el-form-item label="Separator">
      <el-select v-model="form.sep" placeholder="please select delimiter">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="countData()">Count</el-button>
    </el-form-item>
    <!-- <el-table :data="tableData" height="250" style="width: 100%">
      <el-table-column prop="File" label="File" width="400"></el-table-column>
      <el-table-column prop="Rows" label="Rows" width="200"></el-table-column>
    </el-table> -->
    <el-table :data="selectedFiles" height="250" style="width: 100%">
      <el-table-column prop="filename" label="file"></el-table-column>
      <el-table-column label="rows">
        <template #default="scope">
          <ElIcon v-if="scope.row.status === ''" class="is-loading">
            <Loading />
          </ElIcon>
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
