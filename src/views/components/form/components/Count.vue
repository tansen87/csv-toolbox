<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  // const tableData = ref([]);
  const isProcessing = ref(false);
  const progress = ref(0);
  const selectedFiles = ref([]);
  const customColors = [
    { color: '#98FB98', percentage: 20 },
    { color: '#7CFC00', percentage: 40 },
    { color: '#7FFF00', percentage: 60 },
    { color: '#ADFF2F', percentage: 80 },
    { color: '#9ACD32', percentage: 100 },
  ];
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

  listen('infomsg', (event: any) => {
    const infoMsg: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === infoMsg.split('|')[0]) {
        file.status = infoMsg.split('|')[1];
      }
    });
  });

  listen('pgscount', (event: any) => {
    const pgs: any = event.payload;
    progress.value = pgs;
  });

  // count csv rows
  async function countData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }
    isProcessing.value = true;
    ElMessage.info('waiting...');
    await invoke('countr', {
      path: data.filePath,
      sep: form.sep,
    });

    // const vls = JSON.parse(JSON.stringify(countrows));
    // const nonEmptyRows = vls.filter((row: any) => row.trim() !== '');
    // tableData.value = nonEmptyRows.map((row: any) => {
    //   const [fileName, rows] = row.split('|');
    //   return { File: fileName, Rows: rows };
    // });

    ElMessage.success('count done.');
  }

  async function selectFile() {
    isProcessing.value = false;
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
    <el-table :data="selectedFiles" height="240" style="width: 100%">
      <el-table-column prop="filename" label="file" width="480"></el-table-column>
      <el-table-column label="rows" width="120">
        <template #default="scope">
          <ElIcon v-if="scope.row.status === ''" class="is-loading">
            <Loading />
          </ElIcon>
          <span>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-progress v-if="isProcessing" :percentage="progress" :color="customColors" />
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
