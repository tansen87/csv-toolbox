<script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import type { TabPaneName } from 'element-plus';
  import { ElDropdown } from 'element-plus';
  import { useTabsView } from './hooks/useTabsView';
  import { useTabsChange } from './hooks/useTabsChange';
  import { translateI18n } from '@/hooks/web/useI18n';
  import { usePermissionStoreHook } from '@/store/modules/permission';
  import type { MultiTabsType } from '@/store/types';
  import SvgIcon from '@/components/SvgIcon/index.vue';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import useSortable from '@/hooks/web/useSortable';

  const { appConfig } = useRootSetting();

  const route = useRoute();
  const router = useRouter();

  const { multiTabs: storeMultiTabs, MultiTabsDropReordering } = usePermissionStoreHook();

  const multiTabs = computed<MultiTabsType[]>(() => storeMultiTabs);

  const { visible, rightClickTags, rightViewStyle, contextmenu, rightViewChange } =
    useTabsView(multiTabs);

  const { setTabPaneKey, addRouteTabs, onFresh, removeTab } = useTabsChange(multiTabs);

  const editableTabsValue = ref(setTabPaneKey(route));

  watch(
    () => [route.path],
    async () => {
      addRouteTabs(route.matched[route.matched.length - 1] as unknown as MultiTabsType);
      editableTabsValue.value = setTabPaneKey(route);
    },
    {
      immediate: true,
    },
  );

  const tabRemoveChange = (e: TabPaneName) => {
    const item = multiTabs.value.find((i) => setTabPaneKey(i) === e);
    if (item) removeTab(item);
  };

  const changeTab = (e: MultiTabsType) => {
    router.push({
      path: e.path,
      query: e.query,
    });
  };

  const elDropdownRef = ref<InstanceType<typeof ElDropdown>>();

  const tabPaneMenu = (item: MultiTabsType, event: MouseEvent) => {
    elDropdownRef.value?.handleClose();
    contextmenu(item, event);
  };

  const { initSortable, destroy } = useSortable({
    handle: '.tabs-view-item',
    onEnd({ newIndex, oldIndex }) {
      const oldMultiTabs = multiTabs.value;
      const currTab = oldMultiTabs.splice(oldIndex as number, 1)[0];
      oldMultiTabs.splice(newIndex as number, 0, currTab);
      MultiTabsDropReordering(oldMultiTabs);
    },
  });

  const initTableDrag = () => {
    if (!appConfig.value.closeTabDrag)
      initSortable(document.querySelector<HTMLElement>('.tabs-container .el-tabs__nav'));
  };

  onMounted(() => {
    initTableDrag();
  });

  watch(
    () => appConfig.value.closeTabDrag,
    (closeTabDrag) => {
      if (closeTabDrag) destroy();
      else initTableDrag();
    },
  );
</script>

<template>
  <div v-if="!appConfig.hideTabs" class="main-container-tabs">
    <div class="tabs-container">
      <el-tabs
        v-model="editableTabsValue"
        type="card"
        class="tabs-view"
        :closable="multiTabs.length > 1"
        @tab-remove="tabRemoveChange"
      >
        <el-tab-pane
          v-for="item in multiTabs"
          :key="setTabPaneKey(item)"
          :name="setTabPaneKey(item)"
        >
          <template #label>
            <div
              class="tabs-view-item"
              @click="changeTab(item)"
              @contextmenu.prevent="tabPaneMenu(item, $event)"
            ></div>
            <span>{{ translateI18n(item.meta?.title) }}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
    </div>

    <transition name="el-zoom-in-top">
      <ul v-show="visible" class="right-view" :style="rightViewStyle">
        <li
          v-for="(item, key) in rightClickTags"
          :key="key"
          class="right-view-item cursor"
          :class="{ disabled: item.disabled }"
          @click="rightViewChange(item)"
        >
          <span>{{ item.text }}</span>
        </li>
      </ul>
    </transition>
    <div v-if="!appConfig.hideTabsConfig" class="right-button">
      <ul>
        <li class="cursor" @click="onFresh()">
          <SvgIcon class="rotate" name="iEL-refresh"></SvgIcon>
        </li>
        <li>
          <ElDropdown
            ref="elDropdownRef"
            trigger="click"
            placement="bottom-end"
            @visible-change="(e: boolean) => e && contextmenu(route)"
          >
            <SvgIcon class="action-item cursor" name="iEL-arrow-down"></SvgIcon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, key) in rightClickTags"
                  :key="key"
                  :command="{ key, item }"
                  :disabled="item.disabled"
                  @click="rightViewChange(item)"
                >
                  {{ item.text }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </ElDropdown>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .main-container-tabs {
    display: flex;
    position: relative;

    // .el-tabs :deep(.el-tabs__header) {
    //   margin: 0;
    // }

    .tabs-container {
      flex: 1;
      width: 0;

      .tabs-view {
        .tabs-view-item {
          position: absolute;
          left: 0;
          width: 100%;
          height: 100%;
        }
      }
    }

    .el-tabs {
      height: $tabs-page-height;
      margin: 0 10px;

      :deep(.el-tabs__header) {
        height: 100%;
        margin: 0;
        border: none;
        // display: flex;
        // align-items: center;
        .el-tabs__nav-wrap,
        .el-tabs__nav-scroll {
          height: 100%;
        }

        .el-tabs__nav-scroll {
          display: flex;
          align-items: center;

          .el-tabs__nav {
            border: none;
            border-radius: 0;

            .el-tabs__item {
              height: 100%;
              margin-right: 4px;
              border: 1px solid var(--border-color-light);
              border-radius: 4px;
              line-height: $tabs-page-height - 10;
            }
          }
        }

        .el-tabs__nav-next,
        .el-tabs__nav-prev {
          height: $tabs-page-height;
          line-height: $tabs-page-height;
        }
        // .el-tabs__nav-*{

        // }
      }
    }

    .right-view {
      position: fixed;
      z-index: 999;
      padding: 5px;
      border: 1px solid var(--border-color-light);
      border-radius: 5px;
      background-color: var(--main-bg-color);
      box-shadow: 0 0 12px rgb(28 29 30 / 8%);

      .right-view-item {
        display: flex;
        align-items: center;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: var(--font-size-base);

        .right-view-item-icon {
          margin-right: 5px;
        }

        &:hover {
          background-color: var(--sub-color-8);
        }
      }
    }

    .right-button {
      ul {
        display: flex;

        li {
          display: flex;
          align-items: center;
          justify-content: center;
          width: $tabs-page-height;
          height: $tabs-page-height;
          border-left: 1px solid var(--border-color-light);
          font-size: var(--font-size-medium);
          text-align: center;

          .action-item {
            height: $tabs-page-height;
            font-size: var(--font-size-medium);
          }
        }

        /* 刷新按钮动画效果 */
        .refresh-button {
          animation: rotate 600ms linear infinite;
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(-360deg);
          }
        }
      }
    }
  }
</style>
