<script lang="ts"></script>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useIntervalFn } from '@vueuse/core';

  const chartRef = ref<HTMLDivElement | null>(null);

  onMounted(async () => {
    useIntervalFn(() => {}, 2000, { immediate: true });
  });
</script>

<template>
  <div class="page-container">
    <div ref="chartRef" class="chart-ref"></div>
  </div>
</template>

<style scoped lang="scss">
  .chart-ref {
    width: 100%;
    height: 100%;
  }

  .page-container {
    width: 100%;
    height: 100%;
  }
</style>
