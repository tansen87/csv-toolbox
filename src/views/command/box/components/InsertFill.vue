<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/plugin-dialog';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const isLoading = ref(false);
  const isFinish = ref(false);
  const isRuntime = ref(false);
  const runtime = ref(0.0);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
    sep: '|',
    col: 'A|B|C|D',
    input: 'hello|world|你好|世界',
  });

  listen('insert_col_err', (event: any) => {
    const error: any = event.payload;
    const insertBCerr: any = 'insertc error: ' + error;
    ElMessage.error(insertBCerr);
  });
  listen('run_time', (event: any) => {
    const time: any = event.payload;
    runtime.value = time;
  });

  // insert data
  async function insertData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isLoading.value = true;
      isFinish.value = false;
      isRuntime.value = false;
      await invoke('insertcol', {
        path: data.filePath,
        sep: data.sep,
        col: data.col,
        input: data.input,
      });
      isLoading.value = false;
      isFinish.value = true;
      isRuntime.value = true;
      ElMessage.success('insert done.');
    }
  }

  async function selectFile() {
    isFinish.value = false;
    isLoading.value = false;
    isRuntime.value = false;
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
    <el-form-item label="Columns">
      <el-input v-model="data.col" clearable />
    </el-form-item>
    <el-form-item label="Input">
      <el-input v-model="data.input" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="insertData()">Insert</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="primary">{{ getCSVMsg }}</el-text>
  <p></p>
  <el-icon v-if="isLoading" color="#FF8C00" class="is-loading"> <Loading /> </el-icon>
  <el-icon v-if="isFinish" color="#32CD32"> <SuccessFilled /> </el-icon>
  <el-text v-if="isRuntime" :style="{ color: '#32CD32', fontSize: '20px' }">{{ runtime }}</el-text>
</template>
