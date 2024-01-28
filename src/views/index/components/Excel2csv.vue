<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getExcelMsg = ref([]);
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['xlsx', 'xls', 'xlsb', 'xlsm', 'xlam', 'xla', 'ods'],
  });
  const form = reactive({
    sep: '',
    column: '',
  });

  listen('success_msg', (event: any) => {
    const msg: any = event.payload;
    ElMessage.success(msg);
  });

  listen('etocerr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error);
  });

  // convert excel to csv
  async function excelTocsv() {
    if (data.filePath == '') {
      ElMessage.warning('未选择excel文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      await invoke('etoc', {
        path: data.filePath,
      });
      loading.value = false;
      ElMessage.success('convert done.');
    }
  }

  async function selectFile() {
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
      // user selected multiple files
      data.filePath = selected.toString();
    } else if (selected === null) {
      // user cancelled the selection
      return;
    } else {
      // user selected a single file
      data.filePath = selected;
    }
    getExcelMsg.value = selected as never;
  }
</script>

<template>
  <el-form v-loading="loading" element-loading-text="Converting..." :model="form">
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="excelTocsv()">Convert</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getExcelMsg[0] }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
