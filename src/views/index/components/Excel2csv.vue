<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage, ElIcon } from 'element-plus';

  const selectedFiles = ref([]);
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['xlsx', 'xls', 'xlsb', 'xlsm', 'xlam', 'xla', 'ods'],
  });
  const form = reactive({
    sep: '',
    column: '',
  });

  listen('success_msg', (event: any) => {
    const msg: any = event.payload;
    // ElMessage.success(msg);
    selectedFiles.value.forEach((file) => {
      if (file.filename === msg.split('|')[0]) {
        file.status = 'completed';
      }
    });
  });

  listen('etocerr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error);
  });

  // convert excel to csv
  async function excelTocsv() {
    if (data.filePath == '') {
      ElMessage.warning('未选择excel文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      await invoke('etoc', {
        path: data.filePath,
      });
      loading.value = false;
      ElMessage.success('convert done.');
    }
  }

  async function selectFile() {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: 'Excel',
          extensions: data.fileFormats,
        },
      ],
    });
    if (Array.isArray(selected)) {
      data.filePath = selected.toString();
      const nonEmptyRows = selected.filter((row: any) => row.trim() !== '');
      selectedFiles.value = nonEmptyRows.map((file: any) => {
        return { filename: file, status: 'awaiting' };
      });
    } else if (selected === null) {
      return;
    } else {
      data.filePath = selected;
    }
  }
</script>

<template>
  <el-form v-loading="loading" element-loading-text="Loading..." :model="form">
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="excelTocsv()">Convert</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="250" style="width: 100%">
    <el-table-column prop="filename" label="file"></el-table-column>
    <el-table-column label="status">
      <template #default="scope">
        <ElIcon v-if="scope.row.status === 'awaiting'" class="is-loading">
          <Loading />
        </ElIcon>
        <ElIcon v-else-if="scope.row.status === 'completed'">
          <Check />
        </ElIcon>
        <!-- <span>{{ scope.row.status }}</span> -->
      </template>
    </el-table-column>
  </el-table>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
