<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage, ElIcon } from 'element-plus';

  interface User {
    filename: string;
    status: string;
  }
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
  const filterHandler = (value: string, row: User, column: TableColumnCtx<User>) => {
    const property = column['property'];
    return row[property] === value;
  };
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
    sep: '|',
    column:
      '借方发生额|贷方发生额|借方发生额-外币|贷方发生额-外币|借方数量|贷方数量|期初数-外币|期初数|期末数外币|期末数|期初数量|期末数量',
  });

  listen('c2x_err', (event: any) => {
    const error: any = 'c2x_err: ' + event.payload;
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0,
    });
  });

  listen('c2x_progress', (event: any) => {
    const pgs: any = event.payload;
    progress.value = pgs;
  });

  listen('read_err', (event: any) => {
    const error: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename === error.split('|')[0]) {
        file.status = 'error';
      }
    });
    ElMessage({
      showClose: true,
      message: 'read_err: ' + error,
      type: 'error',
      duration: 0,
    });
  });

  listen('rows_err', (event: any) => {
    const error: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === error.split('|')[0]) {
        file.status = 'error';
      }
    });
    ElMessage({
      showClose: true,
      message: 'rows_err: ' + error,
      type: 'error',
      duration: 0,
    });
  });

  listen('c2x_msg', (event: any) => {
    const c2xMsg: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename === c2xMsg) {
        file.status = 'completed';
      }
    });
  });

  // convert csv to xlsx
  async function csvToxlsx() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isProcessing.value = true;
      await invoke('ctox', {
        path: data.filePath,
        sep: data.sep,
        column: data.column,
      });
      ElMessage.success('convert done.');
    }
  }

  // open file
  async function selectFile() {
    selectedFiles.value = [];
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
      ElMessage.warning('未选择文件');
      return;
    } else {
      data.filePath = selected;
    }
  }
</script>

<template>
  <el-form :model="data">
    <el-form-item label="Separator">
      <el-select v-model="data.sep">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item label="Numeric col">
      <el-input v-model="data.column" placeholder="Please input numeric column" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="csvToxlsx()">Convert</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="230" style="width: 100%">
    <el-table-column prop="filename" label="file" width="480"></el-table-column>
    <el-table-column
      prop="status"
      label="status"
      :filters="[
        { text: 'x', value: 'error' },
        { text: '√', value: 'completed' },
      ]"
      :filter-method="filterHandler"
      width="120"
    >
      <template #default="scope">
        <ElIcon v-if="scope.row.status === 'awaiting'" class="is-loading">
          <Loading />
        </ElIcon>
        <ElIcon v-else-if="scope.row.status === 'completed'" color="#00CD66">
          <Select />
        </ElIcon>
        <ElIcon v-else-if="scope.row.status === 'error'" color="#FF0000">
          <CloseBold />
        </ElIcon>
      </template>
    </el-table-column>
  </el-table>
  <el-progress v-if="isProcessing" :percentage="progress" :color="customColors" />
</template>
