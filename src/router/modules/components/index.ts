import type { AppRouteRecordRaw } from '@/router/type';
import { t } from '@/hooks/web/useI18n';

const component: AppRouteRecordRaw[] = [
  {
    path: '/components',
    redirect: '/components/box',
    name: 'RtComponents',
    meta: { title: t('route.pathName.components'), icon: 'components', position: 2 },
    children: [
      {
        path: 'box',
        name: 'RtBox',
        component: () => import('@/views/components/box/index.vue'),
        meta: { title: t('route.pathName.box'), keepAlive: true },
      },
      {
        path: 'file',
        name: 'RtFile',
        component: () => import('@/views/components/file/index.vue'),
        meta: { title: t('route.pathName.file') },
      },
      {
        path: 'database',
        name: 'RtDatabase',
        component: () => import('@/views/components/database/index.vue'),
        meta: { title: t('route.pathName.database') },
      },
      {
        path: 'rename',
        name: 'RtRename',
        component: () => import('@/views/components/rename/index.vue'),
        meta: { title: t('route.pathName.rename') },
      },
    ],
  },
];

export default component;
