<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const isLoading = ref(false);
  const isFinish = ref(false);
  const isWrite = ref(false);
  const countRows = ref(0);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext', 'dat'],
    sep: '|',
    column: '科目名称',
    mode: 'equal',
    condition: '银行存款|应收账款',
  });

  listen('yml_err', (event: any) => {
    const error: any = event.payload;
    const ymlerr: any = 'yml_err error: ' + error;
    ElMessage.error(ymlerr);
  });
  listen('equal_err', (event: any) => {
    const error: any = event.payload;
    const equalerr: any = 'equal_err error: ' + error;
    ElMessage.error(equalerr);
  });
  listen('equal_count', (event: any) => {
    const count: any = event.payload;
    countRows.value = count;
  });
  listen('contains_err', (event: any) => {
    const error: any = event.payload;
    const containserr: any = 'contains_err error: ' + error;
    ElMessage.error(containserr);
  });
  listen('contains_count', (event: any) => {
    const count: any = event.payload;
    countRows.value = count;
  });
  listen('startswith_err', (event: any) => {
    const error: any = event.payload;
    const startswitherr: any = 'startswith_err error: ' + error;
    ElMessage.error(startswitherr);
  });

  // filter data
  async function isinData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isLoading.value = true;
      isFinish.value = false;
      isWrite.value = true;
      await invoke('filter', {
        path: data.filePath,
        sep: data.sep,
        column: data.column,
        mode: data.mode,
        condition: data.condition,
      });
      isLoading.value = false;
      isFinish.value = true;
      ElMessage.success('filter done.');
    }
  }

  async function selectFile() {
    isFinish.value = false;
    isLoading.value = false;
    isWrite.value = false;
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
    <el-form-item label="Filter col">
      <el-input v-model="data.column" clearable placeholder="Please input column" />
    </el-form-item>
    <el-form-item label="Filter mode">
      <el-select v-model="data.mode">
        <el-option label="equal" value="equal" />
        <el-option label="contains" value="contains" />
        <el-option label="startswith" value="startswith" />
      </el-select>
    </el-form-item>
    <el-form-item label="conditions">
      <el-input
        v-model="data.condition"
        autosize
        type="textarea"
        placeholder="Please input conditions"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="isinData()">Query</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="primary">{{ getCSVMsg }}</el-text>
  <p></p>
  <el-icon v-if="isLoading" color="#FF8C00" class="is-loading"> <Loading /> </el-icon>
  <el-icon v-if="isFinish" color="#32CD32"> <SuccessFilled /> </el-icon>
  <el-text v-if="isWrite" class="mx-1">{{ countRows }}</el-text>
</template>
