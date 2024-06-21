<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage, ElIcon } from 'element-plus';
  import { CloseBold, Select } from '@element-plus/icons-vue';

  interface User {
    filename: string;
    status: string;
  }
  const selectedFiles = ref([]);
  const isProcessing = ref(false);
  const progress = ref(0);
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
    fileFormats: ['xlsx', 'xls', 'xlsb', 'xlsm', 'xlam', 'xla', 'ods'],
  });

  listen('row_count_err', (event: any) => {
    const msg: any = event.payload;
    const warning_msg = 'row_count_err: ' + event.payload;
    ElMessage({
      showClose: true,
      message: warning_msg,
      type: 'warning',
      duration: 0,
    });
    selectedFiles.value.forEach((file) => {
      if (file.filename === msg.split('|')[0]) {
        file.status = 'error';
      }
    });
  });

  listen('e2c_msg', (event: any) => {
    const e2cMsg: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename === e2cMsg.split('|')[0]) {
        file.status = 'completed';
      }
    });
  });

  listen('e2c_progress', (event: any) => {
    const pgs: any = event.payload;
    progress.value = pgs;
  });

  listen('e2c_err', (event: any) => {
    const error: any = 'e2c_err: ' + event.payload;
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0,
    });
  });

  // convert excel to csv
  async function excelTocsv() {
    if (data.filePath == '') {
      ElMessage.warning('未选择excel文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isProcessing.value = true;
      await invoke('etoc', {
        path: data.filePath,
      });
      ElMessage.success('convert done.');
    }
  }

  // open file
  async function selectFile() {
    isProcessing.value = false;
    selectedFiles.value = [];
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: 'Excel',
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
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="excelTocsv()">Convert</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="250" style="width: 100%">
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
        <!-- <span>{{ scope.row.status }}</span> -->
      </template>
    </el-table-column>
  </el-table>
  <el-progress v-if="isProcessing" :percentage="progress" :color="customColors" />
</template>
