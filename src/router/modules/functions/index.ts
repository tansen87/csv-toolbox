import type { AppRouteRecordRaw } from '@/router/type';
import { t } from '@/hooks/web/useI18n';

const functions: AppRouteRecordRaw[] = [
  {
    path: '/functions',
    redirect: '/functions/preview-pdf',
    name: 'Functions',
    meta: {
      title: 'route.pathName.functions',
      icon: 'iEL-briefcase',
      position: 2,
      whiteRoute: true,
      alwaysShow: true,
    },
    children: [
      {
        path: 'water_mark',
        name: 'RtWaterMark',
        component: () => import('@/views/functions/water-mark/index.vue'),
        meta: { title: t('route.pathName.waterMark') },
      },
      {
        path: 'guide',
        name: 'RtGuide',
        component: () => import('@/views/functions/guide/index.vue'),
        meta: { title: t('route.pathName.guide') },
      },
    ],
  },
];

export default functions;
