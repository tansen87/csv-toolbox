<script setup lang="ts">
  import { ref, reactive, toRaw } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const cntMsg = ref('');
  const formData = ref(toRaw(cntMsg));
  const tableData = ref([]);
  const title = ref([]);
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sep: '|',
  });

  listen('countErr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error);
  });

  listen('cntrows', (event: any) => {
    const msg: any = event.payload;
    cntMsg.value = msg;
    // console.log(cntMsg.value);
  });

  // count csv rows
  async function countData() {
    title.value = [];
    tableData.value = [];
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      let _value = await invoke('count', {
        path: data.filePath,
        sep: form.sep,
      });
      const vls = JSON.parse(JSON.stringify(formData.value));
      const vlsp = vls.map((item) => item.split('|'));
      this.tableData = vlsp.map((item) => ({
        File: item[0],
        Rows: item[1],
      }));

      for (const key in tableData.value[0]) {
        title.value.push(key);
      }
      tableData.value.forEach((item) => {
        let obj = {};
        title.value.forEach((item2, index2) => {
          // console.log('item', item[item2]);
          obj['in' + index2] = item[item2];
        });
        tableData.value.push(obj);
      });
      ElMessage.success('count successfully.');
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
      // user selected multiple files
      data.filePath = selected.toString();
    } else if (selected === null) {
      // user cancelled the selection
      return;
    } else {
      // user selected a single file
      data.filePath = selected;
    }
    getCSVMsg.value = selected.toString();
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
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="countData()">Count</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg }}</el-text>
  <el-table :data="tableData" height="250" style="width: 100%">
    <el-table-column
      v-for="(item, index) in title"
      :key="index"
      :prop="'in' + index"
      :label="item"
      width="480"
    />
  </el-table>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
