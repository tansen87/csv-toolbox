<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/plugin-dialog';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const isProcessing = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext', 'dat'],
    sep: ',',
    index: '被审计单位|科目编号',
    values: '借方发生额|贷方发生额',
  });

  listen('pivot_err', (event: any) => {
    const error: any = 'pivot_err: ' + event.payload;
    ElMessage.error(error);
  });

  // data pivot
  async function ptData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isProcessing.value = true;
      await invoke('pivot', {
        path: data.filePath,
        sep: data.sep,
        index: data.index,
        values: data.values,
      });
      isProcessing.value = false;
      ElMessage.success('pivot done.');
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
    <el-form-item label="Sepa">
      <el-select v-model="data.sep">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
        <el-option label=";" value=";" />
      </el-select>
    </el-form-item>
    <el-form-item label="Index">
      <el-input v-model="data.index" clearable placeholder="Please input row columns" />
    </el-form-item>
    <el-form-item label="Value">
      <el-input v-model="data.values" clearable placeholder="Please input value columns" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="ptData()">Pivot</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg }}</el-text>
  <el-progress
    v-if="isProcessing"
    :percentage="50"
    :indeterminate="true"
    status="warning"
    :duration="3"
  />
</template>
