<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage, ElIcon } from 'element-plus';
  import { CloseBold } from '@element-plus/icons-vue';

  const selectedFiles = ref([]);
  const isLoading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
    sep: '|',
  });

  listen('cat_err', (event: any) => {
    const error: any = 'cat_err: ' + event.payload;
    let catErr = event.payload.split('|');
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0,
    });
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === catErr[0] && catErr[1] === 'Error') {
        file.status = 'error';
      }
    });
  });
  listen('read_err', (event: any) => {
    const error: any = 'read_err: ' + event.payload;
    let readErr = event.payload.split('|');
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0,
    });
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === readErr[0] && readErr[1] === 'Error') {
        file.status = 'error';
      }
    });
  });

  // data concat
  async function concatData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }
    if (data.filePath != '') {
      isLoading.value = true;
      ElMessage.info('waiting...');
      await invoke('concat', {
        path: data.filePath,
        sep: data.sep,
      });
      isLoading.value = false;
      ElMessage({
        showClose: true,
        message: 'concat done.',
        type: 'success',
        duration: 0,
      });
    }
  }

  // open file
  async function selectFile() {
    selectedFiles.value = [];
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
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" :loading="isLoading" icon="el-icon-loading" @click="concatData()"
        >Concat</el-button
      >
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="250" style="width: 100%">
    <el-table-column prop="filename" label="file" width="480"></el-table-column>
    <el-table-column label="status" width="120">
      <template #default="scope">
        <ElIcon v-if="scope.row.status === 'error'" color="#FF0000">
          <CloseBold />
        </ElIcon>
      </template>
    </el-table-column>
  </el-table>
</template>
