<script setup lang="ts">
  import { ref } from 'vue';
  import Sidebar from '../../components/Sidebar/index.vue';
  import MinSidebar from '../../components/Sidebar/MinSidebar.vue';
  import Setting from '../../components/Seting/index.vue';
  import Breadcrumb from '../../components/Breadcrumb/index.vue';
  import AppLogo from '../AppLogo/index.vue';

  import { AppLocale, AppTheme } from '@/components/Application';

  import SvgIcon from '@/components/SvgIcon/index.vue';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';

  const drawer = ref(false);

  const { appConfig } = useRootSetting();
</script>

<template>
  <div class="navbar">
    <div v-show="!appConfig.hideNavbart" class="navbar-content">
      <div class="navbar-left">
        <Breadcrumb v-if="appConfig.sidebarMode === 'vertical' || appConfig.drawerSidebar" />
        <AppLogo v-if="appConfig.sidebarMode === 'horizontal' && !appConfig.drawerSidebar" />
      </div>
      <div class="navbar-center">
        <template v-if="!appConfig.drawerSidebar">
          <Sidebar
            v-if="appConfig.sidebarMode === 'horizontal'"
            class="sidebar-horizontal"
            mode="horizontal"
          />
          <MinSidebar
            v-if="appConfig.sidebarMode === 'blend'"
            class="sidebar-horizontal"
            mode="horizontal"
          />
        </template>
      </div>
      <div class="navbar-right">
        <AppLocale class="icon"></AppLocale>
        <AppTheme></AppTheme>
        <AppAccount></AppAccount>
        <SvgIcon class="cursor" name="iEL-setting" @click="drawer = true"></SvgIcon>
      </div>
    </div>
    <div v-show="appConfig.hideNavbart" class="setting-icon cursor">
      <SvgIcon name="iEL-setting" @click="drawer = true"></SvgIcon>
    </div>
    <Setting v-model:modelValue="drawer"></Setting>
  </div>
</template>

<style lang="scss" scoped>
  .navbar {
    width: 100%;
    border-bottom: 1px solid var(--border-color-light);
    // margin-left: #{$side-bar-width};
    background-color: $nav-bar-color;
    box-shadow: 1px 0 20px rgb(0 0 0 / 8%);

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: #{$nav-bar-height};
      font-size: var(--font-size-extra-large);

      // .navbar-left {
      //   display: flex;
      //   align-items: center;
      // }

      .navbar-center {
        flex: 1;
        min-width: 0;
        height: 100%;
      }

      .navbar-right {
        display: grid;
        grid-auto-flow: column;
        grid-gap: 10px;
        align-items: center;
        margin-right: 10px;
      }
    }

    .setting-icon {
      display: flex;
      position: fixed;
      z-index: 99;
      top: 50%;
      right: 0;
      padding: 8px;
      transform: translateY(-50%);
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;
      background-color: var(--main-color);
      color: #fff;
      font-size: var(--font-size-extra-large);
    }
  }
</style>
