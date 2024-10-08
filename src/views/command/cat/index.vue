<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/plugin-dialog';
  import { invoke } from '@tauri-apps/api/core';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';
  import { FolderOpened, Connection } from '@element-plus/icons-vue';

  const selectedFiles = ref([]);
  const isLoading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: [
      'csv',
      'txt',
      'tsv',
      'spext',
      'dat',
      'parquet',
      'xls',
      'xlsx',
      'xlsm',
      'xlsb',
      'ods',
    ],
    sep: ',',
  });

  listen('cat_err', (event: any) => {
    const error: any = 'cat_err: ' + event.payload;
    ElMessage({
      showClose: true,
      message: error,
      type: 'error',
      duration: 0,
    });
  });

  // open file
  async function selectFile() {
    selectedFiles.value = [];
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: '',
          extensions: data.fileFormats,
        },
      ],
    });
    if (Array.isArray(selected)) {
      data.filePath = selected.join('|').toString();
      console.log(data.filePath);
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

  // data concat
  async function concatData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择文件');
      return;
    }
    if (data.filePath != '') {
      isLoading.value = true;
      ElMessage.info('Running...');
      await invoke('concat', {
        filePath: data.filePath,
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
</script>

<template>
  <el-scrollbar class="page-container">
    <el-form>
      <div style="display: flex; align-items: flex-start; justify-content: space-between">
        <div style="display: flex; align-items: flex-start">
          <el-button type="primary" :icon="FolderOpened" plain @click="selectFile()">
            Open File
          </el-button>
          <el-select v-model="data.sep" style="width: 100px; margin-left: 16px">
            <el-option label="," value="," />
            <el-option label="|" value="|" />
            <el-option label="\t" value="\t" />
            <el-option label=";" value=";" />
          </el-select>
          <el-button
            type="success"
            :loading="isLoading"
            :icon="Connection"
            plain
            style="margin-left: 16px"
            @click="concatData()"
          >
            Concat
          </el-button>
        </div>
        <el-text type="primary" size="large">
          <el-icon> <Connection /> </el-icon>
          Concatenate CSV and Excel files by column
        </el-text>
      </div>
    </el-form>
    <el-table :data="selectedFiles" height="420" style="width: 100%">
      <el-table-column prop="filename" />
    </el-table>
  </el-scrollbar>
</template>
