<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const isProcessing = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext', 'dat'],
    sep: '|',
    column: '科目名称',
  });

  listen('unique_err', (event: any) => {
    const error: any = 'unique_err: ' + event.payload;
    ElMessage.error(error);
  });

  // data unique
  async function uniqueData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isProcessing.value = true;
      await invoke('unique', {
        path: data.filePath,
        sep: data.sep,
        column: data.column,
      });
      isProcessing.value = false;
      ElMessage.success('unique done.');
    }
  }

  async function selectFile() {
    isProcessing.value = false;
    const selected = await open({
      multiple: false,
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
    getCSVMsg.value = selected.toString();
  }
</script>

<template>
  <el-form :model="data">
    <el-form-item label="Separator">
      <el-select v-model="data.sep">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
        <el-option label=";" value=";" />
      </el-select>
    </el-form-item>
    <el-form-item label="Column">
      <el-input v-model="data.column" clearable placeholder="Please input column" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="uniqueData()">Unique</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg }}</el-text>
  <el-progress
    v-if="isProcessing"
    :percentage="50"
    :indeterminate="true"
    status="warning"
    :duration="5"
  />
</template>
