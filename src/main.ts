import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import App from './App.vue';
import { getServerConfig } from './config';
import { configMainGlobalProperties } from './utils';
import { configMainStore } from './store';
import { configMainI18n } from './locales';
import { configMainRouter } from './router';
import { useElementPlus } from './utils/plugin/element';

// tailwind css
import '@/styles/tailwind.css';
// element-plus dark style
import 'element-plus/theme-chalk/src/dark/css-vars.scss';
// 公共样式
import '@/styles/index.scss';

const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

getServerConfig(app).then(async (config) => {
  // 路由
  await configMainRouter(app);

  // 全局钩子
  configMainGlobalProperties(app);

  // Pinia
  configMainStore(app);

  // 国际化
  configMainI18n(app, config.locale);

  // ElementPlus
  useElementPlus(app);

  app.mount('#app');
});
