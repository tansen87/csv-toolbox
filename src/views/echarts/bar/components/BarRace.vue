<script lang="ts"></script>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useIntervalFn } from '@vueuse/core';

  const chartRef = ref<HTMLDivElement | null>(null);

  const data: number[] = [];
  for (let i = 0; i < 5; ++i) {
    data.push(Math.round(Math.random() * 200));
  }

  onMounted(() => {
    useIntervalFn(
      () => {
        run();
      },
      3000,
      { immediate: true },
    );
  });

  function run() {
    for (var i = 0; i < data.length; ++i) {
      if (Math.random() > 0.9) {
        data[i] += Math.round(Math.random() * 2000);
      } else {
        data[i] += Math.round(Math.random() * 200);
      }
    }
  }
</script>

<template>
  <div>
    <h3>动态柱状图</h3>
    <div ref="chartRef" class="chart-ref"></div>
  </div>
</template>

<style scoped lang="scss">
  .chart-ref {
    width: 100%;
    height: 380px;
  }
</style>
