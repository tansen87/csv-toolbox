<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getYamlMsg = ref('');
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['yaml', 'yml'],
  });
  const form = reactive({
    region: '凭证表&科目余额表',
    input: '业务说明',
    epath: 'C:\\Users',
  });

  listen('check', (event: any) => {
    const check: any = event.payload;
    ElMessage.info(check);
  });

  listen('prepare_err', (event: any) => {
    const error: any = 'prepare_err: ' + event.payload;
    ElMessage.error(error);
  });
  listen('execute_err', (event: any) => {
    const error: any = 'execute_err: ' + event.payload;
    ElMessage.error(error);
  });

  listen('errcode', (event: any) => {
    const errCode: any = event.payload;
    ElMessage.error(errCode);
  });

  listen('message', (event: any) => {
    const progress: any = event.payload;
    ElMessage.success(progress);
  });

  // download mysql data
  async function getData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择yaml文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      await invoke('download', {
        filePath: data.filePath,
        etable: form.region,
        rcolumn: form.input,
        epath: form.epath,
      });
      loading.value = false;
      ElMessage.success('download done.');
    }
  }

  async function selectFile() {
    const selected = await open({
      multiple: false,
      filters: [
        {
          name: 'Yaml',
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
    getYamlMsg.value = selected.toString();
  }
</script>

<template>
  <el-form v-loading="loading" element-loading-text="Downloading..." :model="form">
    <el-form-item label="Export table">
      <el-select v-model="form.region" placeholder="please select download table">
        <el-option label="凭证表&科目余额表" value="凭证表&科目余额表" />
        <el-option label="核算项目明细表&核算项目余额表" value="核算项目明细表&核算项目余额表" />
      </el-select>
    </el-form-item>
    <el-form-item label="Replace col">
      <el-input v-model="form.input" placeholder="Please input replace column" />
    </el-form-item>
    <el-form-item label="Export path">
      <el-input v-model="form.epath" placeholder="Please input export path" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open Yaml</el-button>
      <el-button type="success" @click="getData()">Download</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getYamlMsg }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
