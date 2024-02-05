<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref([]);
  const loading = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sqlsrc: 'select * from table',
    sep: '|',
    memory: true,
  });

  listen('queryErr', (event: any) => {
    const error: any = event.payload;
    const queryErrmsg: any = 'sql query error: ' + error;
    ElMessage.error(queryErrmsg);
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
        memory: form.memory,
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
    } else if (selected === null) {
      return;
    } else {
      data.filePath = selected;
    }
    getCSVMsg.value = selected as never;
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
    <el-form-item label="Memory">
      <el-switch
        v-model="form.memory"
        inline-prompt
        active-text="high"
        inactive-text="low"
        width="50px"
      />
    </el-form-item>
    <el-form-item>
      <el-input
        v-model="form.sqlsrc"
        :autosize="{ minRows: 3, maxRows: 5 }"
        type="textarea"
        placeholder="Please input sql script"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="countData()">Query</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg[0] }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
