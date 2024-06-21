<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const selectedFiles = ref([]);
  const isLoading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext', 'dat'],
    sep: '|',
    column: '被审计单位|记账时间|凭证编号|科目编号|科目名称|借方发生额|贷方发生额',
  });

  listen('catsp_err', (event: any) => {
    const error: any = 'catsp_err: ' + event.payload;
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0,
    });
  });

  // data concat
  async function concatData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isLoading.value = true;
      await invoke('concatsp', {
        path: data.filePath,
        sep: data.sep,
        column: data.column,
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
        return { filename: file };
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
    <el-form-item label="Specific col">
      <el-input v-model="data.column" autosize type="textarea" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" :loading="isLoading" icon="el-icon-loading" @click="concatData()"
        >Concat</el-button
      >
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="200" style="width: 100%">
    <el-table-column prop="filename" label="file" width="480"></el-table-column>
  </el-table>
</template>
