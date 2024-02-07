<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';
  import { Search } from '@element-plus/icons-vue';

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
    mode: 'equal',
    isinput: true,
    condition: '银行存款|应收账款',
  });

  listen('ymlerr', (event: any) => {
    const error: any = event.payload;
    const ymlerr: any = 'read yaml error: ' + error;
    ElMessage.error(ymlerr);
  });
  listen('equalErr', (event: any) => {
    const error: any = event.payload;
    const equalerr: any = 'equal error: ' + error;
    ElMessage.error(equalerr);
  });
  listen('containsErr', (event: any) => {
    const error: any = event.payload;
    const containserr: any = 'contains error: ' + error;
    ElMessage.error(containserr);
  });

  // filter data
  async function isinData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }
    if (yml.filePath == '' && form.isinput === false) {
      ElMessage.warning('未选择yaml文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      await invoke('filter', {
        path: data.filePath,
        ymlpath: yml.filePath,
        sep: form.sep,
        column: form.column,
        mode: form.mode,
        isinput: form.isinput,
        condition: form.condition,
      });
      loading.value = false;
      ElMessage.success('filter done.');
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
  <el-form v-loading="loading" element-loading-text="Querying..." :model="form">
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
    <el-form-item label="Filter mode">
      <el-select v-model="form.mode" placeholder="please select filter mode">
        <el-option label="equal" value="equal" />
        <el-option label="contains" value="contains" />
        <el-option label="startswith" value="startswith" />
      </el-select>
    </el-form-item>
    <el-form-item label="Input or Yaml">
      <el-switch v-model="form.isinput" inline-prompt active-text="input" inactive-text="yaml" />
      <ElText>---</ElText>
      <el-button type="warning" :icon="Search" circle @click="selectYmlFile()" />
    </el-form-item>
    <el-form-item label="conditions">
      <el-input v-model="form.condition" placeholder="Please input conditions" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="isinData()">Query</el-button>
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
