<script setup lang="ts">
import { ref, reactive } from "vue";
import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api/tauri";
import { listen } from '@tauri-apps/api/event';
import { ElMessage } from 'element-plus';

const getCSVMsg = ref("");
const data = reactive({
    filePath: "",
    fileFormats: ["csv", "txt", "*"],
});
const form = reactive({
    sep: ",",
    column: "Currency"
})

listen('uniqueErr', (event: any) => {
    const error: any = event.payload;
    ElMessage.error(error)
})

// data pivot
async function uniqueData() {
    if (data.filePath == "") {
        ElMessage.warning("未选择csv文件")
        return;
    }

    if (data.filePath != "") {
        ElMessage.info("waiting...");
        let value = await invoke("unique", { path: data.filePath, sep: form.sep, column: form.column })
        // .then((msg: any) => ElMessage.success(msg))
        // .catch((err: any) => ElMessage.error(err))
        console.log(value)
        ElMessage.success("get unique value!");
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
        ]
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
        <el-form-item label="Sep">
            <el-select v-model="form.sep" placeholder="please select delimiter">
                <el-option label="," value="," />
                <el-option label="|" value="|" />
            </el-select>
        </el-form-item>
        <el-form-item label="Col">
            <el-input v-model="form.column" placeholder="Please input column" />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="selectFile()">Open File</el-button>
            <el-button type="success" @click="uniqueData()">Unique</el-button>
        </el-form-item>
    </el-form>
    <el-text class="mx-1" type="success">{{ getCSVMsg }}</el-text>
</template>

<style>
.el-input {
    width: 500px;
}
</style>