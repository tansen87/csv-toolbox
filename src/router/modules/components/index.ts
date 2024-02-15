import type { AppRouteRecordRaw } from '@/router/type';
import { t } from '@/hooks/web/useI18n';

const component: AppRouteRecordRaw[] = [
  {
    path: '/components',
    // component: Layout,
    redirect: '/components/form',
    name: 'RtComponents',
    meta: { title: t('route.pathName.components'), icon: 'components', position: 2 },
    children: [
      {
        path: 'form',
        name: 'RtForm',
        component: () => import('@/views/components/form/index.vue'),
        meta: { title: t('route.pathName.form'), keepAlive: true },
      },
      {
        path: 'file',
        name: 'RtFile',
        component: () => import('@/views/components/file/index.vue'),
        meta: { title: t('route.pathName.file') },
      },
    ],
  },
];

export default component;
