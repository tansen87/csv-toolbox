<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { open } from '@tauri-apps/api/dialog';
  import { invoke } from '@tauri-apps/api/tauri';
  import { listen } from '@tauri-apps/api/event';
  import { ElMessage } from 'element-plus';
  import { MoreFilled } from '@element-plus/icons-vue';

  const isSelect = ref(false);
  const data = reactive({
    filePath: '',
    fileFormats: ['*'],
  });

  listen('get_fname_err', (event: any) => {
    const error: any = 'get_fname_err: ' + event.payload;
    ElMessage.error(error);
  });
  listen('write_err', (event: any) => {
    const error: any = 'write_err: ' + event.payload;
    ElMessage.error(error);
  });

  // invoke
  async function GetFileName() {
    if (data.filePath == '') {
      ElMessage.warning('未选择文件');
      return;
    }

    if (data.filePath != '') {
      ElMessage.info('waiting...');
      await invoke('filename', {
        path: data.filePath,
      });
      ElMessage.success('done.');
    }
  }

  async function selectFile() {
    isSelect.value = false;
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
      isSelect.value = true;
      data.filePath = selected.toString();
    } else if (selected === null) {
      isSelect.value = false;
      ElMessage.warning('未选择文件');
      return;
    } else {
      isSelect.value = true;
      data.filePath = selected;
    }
  }
</script>

<template>
  <el-form :model="data">
    <el-form-item>
      <el-button type="primary" @click="selectFile()">Open File</el-button>
      <el-button type="success" @click="GetFileName()">run</el-button>
    </el-form-item>
  </el-form>
  <el-icon v-if="isSelect" color="#32CD32"> <MoreFilled /> </el-icon>
</template>
