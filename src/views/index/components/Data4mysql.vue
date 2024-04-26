<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage, ElIcon } from 'element-plus';
  import { CloseBold, Select } from '@element-plus/icons-vue';

  interface User {
    filename: string;
    status: string;
  }
  const isProcessing = ref(false);
  const progress = ref(0);
  const tableData: any = ref([]);
  const customColors = [
    { color: '#98FB98', percentage: 20 },
    { color: '#7CFC00', percentage: 40 },
    { color: '#7FFF00', percentage: 60 },
    { color: '#ADFF2F', percentage: 80 },
    { color: '#9ACD32', percentage: 100 },
  ];
  const data = reactive({
    filePath: '',
    fileFormats: ['yaml', 'yml'],
    region: '凭证表&科目余额表',
    input: '业务说明',
    epath: 'C:\\Users',
  });
  const filterHandler = (value: string, row: User, column: TableColumnCtx<User>) => {
    const property = column['property'];
    return row[property] === value;
  };

  listen('check', (event: any) => {
    const check: any = event.payload;
    ElMessage.info(check);
    const currentCompany = check.split(',')[0];
    tableData.value.forEach((file: any) => {
      if (file.filename === currentCompany) {
        file.status = 'awaiting';
      }
    });
  });
  listen('prepare_err', (event: any) => {
    const error: any = 'prepare_err: ' + event.payload;
    ElMessage.error(error);
  });
  listen('execute_err', (event: any) => {
    const error: any = 'execute_err: ' + event.payload;
    ElMessage.error(error);
  });
  listen('get_err', (event: any) => {
    const error: any = 'get_err: ' + event.payload;
    ElMessage.error(error);
  });
  listen('errcode', (event: any) => {
    const errCode: any = event.payload;
    ElMessage.error(errCode);
    tableData.value.forEach((file: any) => {
      if (file.filename === errCode.split('|')[0]) {
        file.status = 'error';
      }
    });
  });
  listen('message', (event: any) => {
    const msg: any = event.payload;
    ElMessage.success(msg);
  });
  listen('download_progress', (event: any) => {
    const pgs: any = event.payload;
    progress.value = pgs.split('|')[1];
    tableData.value.forEach((file: any) => {
      if (file.filename === pgs.split('|')[0]) {
        file.status = 'completed';
      }
    });
  });

  // download mysql data
  async function getData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择yaml文件');
      return;
    }
    if (data.filePath != '') {
      ElMessage.info('waiting...');
      isProcessing.value = true;
      await invoke('download', {
        filePath: data.filePath,
        etable: data.region,
        rcolumn: data.input,
        epath: data.epath,
      });
      ElMessage.success('download done.');
    }
  }

  async function selectFile() {
    isProcessing.value = false;
    tableData.value = [];
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
      data.filePath = selected.toString();
    } else if (selected === null) {
      return;
    } else {
      data.filePath = selected;
    }
    let project: any = await invoke('getyml', {
      path: data.filePath,
    });

    const nonEmptyRows = project.filter((row: any) => row.trim() !== '');
    tableData.value = nonEmptyRows.map((file: any) => {
      return { filename: file, status: '' };
    });
  }
</script>

<template>
  <el-form :model="data">
    <el-form-item label="Export table">
      <el-select v-model="data.region">
        <el-option label="凭证表&科目余额表" value="凭证表&科目余额表" />
        <el-option label="核算项目明细表&核算项目余额表" value="核算项目明细表&核算项目余额表" />
      </el-select>
    </el-form-item>
    <el-form-item label="Replace col">
      <el-input v-model="data.input" clearable placeholder="Please input replace column" />
    </el-form-item>
    <el-form-item label="Export path">
      <el-input v-model="data.epath" clearable placeholder="Please input export path" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open Yaml</el-button>
      <el-button type="success" @click="getData()">Download</el-button>
    </el-form-item>
    <el-table :data="tableData" height="275" style="width: 100%">
      <el-table-column prop="filename" label="file" width="480"></el-table-column>
      <el-table-column
        prop="status"
        label="status"
        :filters="[
          { text: 'x', value: 'error' },
          { text: '√', value: 'completed' },
        ]"
        :filter-method="filterHandler"
        width="120"
      >
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
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-progress v-if="isProcessing" :percentage="progress" :color="customColors" />
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
