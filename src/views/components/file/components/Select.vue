<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';
  import { CloseBold, Select } from '@element-plus/icons-vue';

  const isProcessing = ref(false);
  const progress = ref(0);
  const selectedFiles = ref([]);
  const customColors = [
    { color: '#98FB98', percentage: 20 },
    { color: '#7CFC00', percentage: 40 },
    { color: '#7FFF00', percentage: 60 },
    { color: '#ADFF2F', percentage: 80 },
    { color: '#9ACD32', percentage: 100 },
  ];
  const data = reactive({
    filePath: '',
    fileFormats: ['*'],
    sep: ',',
    columns: 'A|B|C',
  });

  listen('select_err', (event: any) => {
    const error: any = 'select_err: ' + event.payload;
    ElMessage.error(error);
  });
  listen('wtr_err', (event: any) => {
    let wtrMsg = event.payload;
    let wtrMsgSp = wtrMsg.split('|');
    ElMessage.error('wtr_err: ' + wtrMsg);
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === wtrMsgSp[0] && wtrMsgSp[1] === 'error') {
        file.status = 'error';
      }
    });
  });
  listen('select_msg', (event: any) => {
    const selectMsg: any = event.payload;
    selectedFiles.value.forEach((file) => {
      if (file.filename.split('\\').pop() === selectMsg) {
        file.status = 'complete';
      }
    });
  });
  listen('sel_progress', (event: any) => {
    const pgs: any = event.payload;
    progress.value = pgs;
  });

  // invoke
  async function SelectColumns() {
    if (data.filePath == '') {
      ElMessage.warning('未选择文件');
      return;
    }
    isProcessing.value = true;
    if (data.filePath != '') {
      ElMessage.info('waiting...');
      await invoke('select', {
        path: data.filePath,
        sep: data.sep,
        cols: data.columns,
      });
      ElMessage.success('done.');
    }
  }

  async function selectFile() {
    isProcessing.value = false;
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: 'file',
          extensions: data.fileFormats,
        },
      ],
    });
    if (Array.isArray(selected)) {
      data.filePath = selected.toString();
      data.filePath = selected.toString();
      const nonEmptyRows = selected.filter((row: any) => row.trim() !== '');
      selectedFiles.value = nonEmptyRows.map((file: any) => {
        return { filename: file, status: 'await' };
      });
    } else if (selected === null) {
      ElMessage.warning('未选择文件');
      return;
    } else {
      data.filePath = selected;
    }
  }
</script>

<template>
  <el-form :model="data">
    <el-form-item label="Separator">
      <el-select v-model="data.sep">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item label="Select cols">
      <el-input v-model="data.columns" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="SelectColumns()">Select</el-button>
    </el-form-item>
    <el-table :data="selectedFiles" height="230" style="width: 100%">
      <el-table-column prop="filename" label="file" width="480"></el-table-column>
      <el-table-column label="status" width="120">
        <template #default="scope">
          <ElIcon v-if="scope.row.status === 'await'" class="is-loading">
            <Loading />
          </ElIcon>
          <ElIcon v-else-if="scope.row.status === 'complete'" color="#00CD66">
            <Select />
          </ElIcon>
          <ElIcon v-else-if="scope.row.status === 'error'" color="#FF0000">
            <CloseBold />
          </ElIcon>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-progress v-if="isProcessing" :percentage="progress" :color="customColors" />
</template>
