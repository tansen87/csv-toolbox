<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const selectedFiles = ref([]);
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sqlsrc: 'select * from table',
    sep: '|',
  });

  listen('query_err', (event: any) => {
    const error: any = event.payload;
    const queryErrmsg: any = 'query_err: ' + error;
    ElMessage.error(queryErrmsg);
  });

  listen('size_msg', (event: any) => {
    const error: any = event.payload;
    const sizeMsg: any = 'file size error: ' + error;
    ElMessage.error(sizeMsg);
  });

  listen('exec_err', (event: any) => {
    const error: any = 'exec_err: ' + event.payload;
    ElMessage.error(error);
  });

  // count csv rows
  async function countData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }
    if (form.sqlsrc == '') {
      ElMessage.warning('sql script is empty');
      return;
    }

    if (data.filePath != '' && form.sqlsrc != '') {
      ElMessage.info('waiting...');
      loading.value = true;
      await invoke('query', {
        path: data.filePath,
        sqlsrc: form.sqlsrc,
        sep: form.sep,
      });

      loading.value = false;
      ElMessage.success('sql query done.');
    }
  }

  async function selectFile() {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: 'csv',
          extensions: data.fileFormats,
        },
      ],
    });
    if (Array.isArray(selected)) {
      data.filePath = selected.toString();
      const nonEmptyRows = selected.filter((row: any) => row.trim() !== '');
      selectedFiles.value = nonEmptyRows.map((row: any) => {
        return { filename: row };
      });
    } else if (selected === null) {
      return;
    } else {
      data.filePath = selected;
    }
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
    <el-form-item>
      <el-input
        v-model="form.sqlsrc"
        :autosize="{ minRows: 3, maxRows: 6 }"
        type="textarea"
        placeholder="Please input sql script"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="countData()">Query</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="280" style="width: 100%">
    <el-table-column prop="filename" label="File"></el-table-column>
  </el-table>
</template>
