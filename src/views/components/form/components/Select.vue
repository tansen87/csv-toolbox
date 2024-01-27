<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const getYamlMsg = ref('');
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const yml = reactive({
    filePath: '',
    fileFormats: ['yaml', 'yml'],
  });
  const form = reactive({
    sep: '|',
    column: '科目名称',
  });

  listen('isinErr', (event: any) => {
    const error: any = event.payload;
    const isinerr: any = 'isin error: ' + error;
    ElMessage.error(isinerr);
  });
  listen('isinWriteErr', (event: any) => {
    const error: any = event.payload;
    const wtrerr: any = 'isin write error: ' + error;
    ElMessage.error(wtrerr);
  });

  // select data - isin
  async function isinData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }
    if (yml.filePath == '') {
      ElMessage.warning('未选择yaml文件');
      return;
    }

    if (data.filePath != '' && yml.filePath != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      await invoke('isin', {
        path: data.filePath,
        ymlpath: yml.filePath,
        sep: form.sep,
        column: form.column,
      });
      loading.value = false;
      ElMessage.success('isin done.');
    }
  }

  async function selectFile() {
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
  async function selectYmlFile() {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: 'yaml',
          extensions: yml.fileFormats,
        },
      ],
    });
    if (Array.isArray(selected)) {
      yml.filePath = selected.toString();
    } else if (selected === null) {
      return;
    } else {
      yml.filePath = selected;
    }
    getYamlMsg.value = selected.toString();
  }
</script>

<template>
  <el-form v-loading="loading" element-loading-text="Selecting..." :model="form">
    <el-form-item label="Separator">
      <el-select v-model="form.sep" placeholder="please select delimiter">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item label="Filter col">
      <el-input v-model="form.column" placeholder="Please input column" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="warning" @click="selectYmlFile()">Open Yaml</el-button>
      <el-button type="success" @click="isinData()">Select</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="primary">{{ getCSVMsg }}</el-text>
  <p />
  <el-text class="mx-1" type="warning">{{ getYamlMsg }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
