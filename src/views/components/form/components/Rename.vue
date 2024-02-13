<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';
  import { SuccessFilled } from '@element-plus/icons-vue';

  const getCSVMsg = ref('');
  const tableData: any = ref([]);
  const writeRows = ref(0);
  const isFinish = ref(false);
  const isLoading = ref(false);
  const isWrite = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sep: '|',
  });

  listen('get_err', (event: any) => {
    const error: any = event.payload;
    const getErrMsg: any = 'get error: ' + error;
    ElMessage.error(getErrMsg);
  });

  listen('rename_err', (event: any) => {
    const error: any = event.payload;
    const renameErrMsg: any = 'rename error: ' + error;
    ElMessage.error(renameErrMsg);
  });

  listen('len_err', (event: any) => {
    const error: any = event.payload;
    const lenErrMsg: any = 'len error: ' + error;
    ElMessage.warning(lenErrMsg);
  });

  listen('count_rows', (event: any) => {
    const count: any = event.payload;
    writeRows.value = count;
  });

  // rename csv headers
  async function renameData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    ElMessage.info('waiting...');

    const headersStringArray = tableData.value.map((row: any) => row.col2);
    const headersString = headersStringArray.join(',');
    isLoading.value = true;
    isFinish.value = false;
    isWrite.value = true;
    await invoke('rename', {
      path: data.filePath,
      sep: form.sep,
      headers: headersString,
    });
    isLoading.value = false;
    isFinish.value = true;
    ElMessage.success('rename done.');
  }

  async function selectFile() {
    tableData.value = [];
    isLoading.value = false;
    isFinish.value = false;
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

    let headers: any = await invoke('geth', {
      path: data.filePath,
      sep: form.sep,
    });

    for (let i = 0; i < headers.length; i++) {
      const colData = {
        col1: headers[i],
        col2: headers[i % headers.length],
      };
      tableData.value.push(colData);
    }
  }

  async function headerEdit(row: any) {
    return row;
  }
</script>

<template>
  <el-form :model="form">
    <el-form-item label="Separator" class="custom-sep-form-item">
      <el-select v-model="form.sep">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="renameData()">Rename</el-button>
    </el-form-item>
    <el-table :data="tableData" height="340" style="width: 100%">
      <el-table-column prop="col1" label="headers" width="300"></el-table-column>
      <el-table-column prop="col2" label="rename headers" width="300">
        <template #default="{ row }">
          <el-input
            v-model="row.col2"
            placeholder="new header"
            class="custom-header-input"
            @blur="headerEdit(row)"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg }}</el-text>
  <p></p>
  <el-icon v-if="isLoading" color="#FF8C00" class="is-loading"> <Loading /> </el-icon>
  <el-icon v-if="isFinish" color="#32CD32"> <SuccessFilled /> </el-icon>
  <el-text v-if="isWrite" class="mx-1">{{ writeRows }}</el-text>
</template>

<style>
  .custom-sep-form-item {
    width: 100px !important; /* 使用 !important 确保样式优先级 */
  }

  .custom-header-input {
    width: 275px !important; /* 使用 !important 确保样式优先级 */
  }
</style>
