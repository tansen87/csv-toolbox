<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage, ElIcon } from 'element-plus';
  import { CloseBold, Select } from '@element-plus/icons-vue';

  const selectedFiles = ref([]);
  const isProcessing = ref(false);
  const progress = ref(0);
  const customColors = [
    { color: '#98FB98', percentage: 20 },
    { color: '#7CFC00', percentage: 40 },
    { color: '#7FFF00', percentage: 60 },
    { color: '#ADFF2F', percentage: 80 },
    { color: '#9ACD32', percentage: 100 },
  ];
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sep: '|',
    column: '被审计单位,记账时间,凭证编号,科目编号,科目名称,借方发生额,贷方发生额',
  });

  listen('pgscatsp', (event: any) => {
    const pgs: any = event.payload;
    progress.value = pgs;
  });

  listen('infomsg', (event: any) => {
    const infoMsg: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename === infoMsg.split('|')[0]) {
        file.status = 'completed';
      }
    });
  });

  listen('catspErr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error);
  });

  // data concat
  async function concatData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isProcessing.value = true;
      await invoke('concatsp', {
        path: data.filePath,
        sep: form.sep,
        column: form.column,
      });
      ElMessage.success('concat done.');
    }
  }

  async function selectFile() {
    isProcessing.value = false;
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
      // user selected multiple files
      data.filePath = selected.toString();
      const nonEmptyRows = selected.filter((row: any) => row.trim() !== '');
      selectedFiles.value = nonEmptyRows.map((file: any) => {
        return { filename: file, status: 'awaiting' };
      });
    } else if (selected === null) {
      // user cancelled the selection
      return;
    } else {
      // user selected a single file
      data.filePath = selected;
    }
  }
</script>

<template>
  <el-form :model="form">
    <el-form-item label="Separator">
      <el-select v-model="form.sep" placeholder="please select delimiter">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item label="Specific col">
      <el-input v-model="form.column" placeholder="Please input numeric column" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="concatData()">Concat</el-button>
    </el-form-item>
  </el-form>
  <el-table :data="selectedFiles" height="250" style="width: 100%">
    <el-table-column prop="filename" label="file" width="480"></el-table-column>
    <el-table-column prop="status" label="status" width="120">
      <template #default="scope">
        <ElIcon v-if="scope.row.status === 'awaiting'" class="is-loading">
          <Loading />
        </ElIcon>
        <ElIcon v-else-if="scope.row.status === 'completed'" color="#00CD66">
          <Select />
        </ElIcon>
        <ElIcon v-else-if="scope.row.status === 'error'" color="#FF0000">
          <CloseBold />
        </ElIcon>
        <!-- <span>{{ scope.row.status }}</span> -->
      </template>
    </el-table-column>
  </el-table>
  <el-progress v-if="isProcessing" :percentage="progress" :color="customColors" />
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
