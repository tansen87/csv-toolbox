import type { AppRouteRecordRaw } from '@/router/type';
import { t } from '@/hooks/web/useI18n';

const component: AppRouteRecordRaw[] = [
  {
    path: '/command',
    redirect: '/command/box',
    name: 'Rtcommand',
    meta: { title: t('route.pathName.command'), icon: 'components', position: 2 },
    children: [
      {
        path: 'box',
        name: 'RtBox',
        component: () => import('@/views/command/box/index.vue'),
        meta: { title: t('route.pathName.box'), keepAlive: true },
      },
      {
        path: 'cat',
        name: 'RtCat',
        component: () => import('@/views/command/cat/index.vue'),
        meta: { title: t('route.pathName.cat'), keepAlive: true },
      },
      {
        path: 'count',
        name: 'RtCount',
        component: () => import('@/views/command/count/index.vue'),
        meta: { title: t('route.pathName.count'), keepAlive: true },
      },
      {
        path: 'file',
        name: 'RtFile',
        component: () => import('@/views/command/file/index.vue'),
        meta: { title: t('route.pathName.file') },
      },
      {
        path: 'rename',
        name: 'RtRename',
        component: () => import('@/views/command/rename/index.vue'),
        meta: { title: t('route.pathName.rename') },
      },
      {
        path: 'cc',
        name: 'RtCatConvert',
        component: () => import('@/views/command/cat-convert/index.vue'),
        meta: { title: t('route.pathName.cc') },
      },
      {
        path: 'select',
        name: 'RtSelect',
        component: () => import('@/views/command/select/index.vue'),
        meta: { title: t('route.pathName.select') },
      },
      {
        path: 'search',
        name: 'RtSearch',
        component: () => import('@/views/command/search/index.vue'),
        meta: { title: t('route.pathName.search') },
      },
      {
        path: 'polars',
        name: 'RtPolars',
        component: () => import('@/views/command/polars/index.vue'),
        meta: { title: t('route.pathName.polars') },
      },
    ],
  },
];

export default component;
