<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';

  const getCSVMsg = ref('');
  const data = reactive({
    filePath: '',
    fileFormats: ['csv', 'txt', 'tsv', 'spext'],
  });
  const form = reactive({
    sep: '|',
    index: '被审计单位,科目编号',
    values: '借方发生额,贷方发生额',
  });

  listen('pivotErr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error);
  });

  // data pivot
  async function ptData() {
    if (data.filePath == '') {
      ElMessage.warning('未选择csv文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      let value = await invoke('pivot', {
        path: data.filePath,
        sep: form.sep,
        index: form.index,
        values: form.values,
      });
      console.log(value);
      ElMessage.success('pivot successfully.');
    }
  }

  async function selectFile() {
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
    <el-form-item label="Sepa">
      <el-select v-model="form.sep" placeholder="please select delimiter">
        <el-option label="," value="," />
        <el-option label="|" value="|" />
        <el-option label="\t" value="\t" />
      </el-select>
    </el-form-item>
    <el-form-item label="Index">
      <el-input v-model="form.index" placeholder="Please input row" />
    </el-form-item>
    <el-form-item label="Value">
      <el-input v-model="form.values" placeholder="Only supports up to two variables" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="ptData()">Pivot</el-button>
    </el-form-item>
  </el-form>
  <el-text class="mx-1" type="success">{{ getCSVMsg }}</el-text>
</template>

<style>
  .el-input {
    width: 500px;
  }
</style>
