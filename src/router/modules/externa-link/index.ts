import type { AppRouteRecordRaw } from '@/router/type';
import { t } from '@/hooks/web/useI18n';

const externalLink: AppRouteRecordRaw[] = [
  {
    path: '/external-link',
    // component: Layout,
    name: 'RtExternal',
    meta: { title: t('route.pathName.externalLink'), icon: 'link', alwaysShow: true, position: 9 },
    children: [
      {
        path: 'https://github.com/tansen87',
        name: 'RtGitLink',
        meta: { title: t('route.pathName.externalDocument') },
      },
      {
        path: 'embedded-page',
        component: () => import('@/views/external-link/embedded-page/index.vue'),
        name: 'RtGitLink',
        meta: {
          title: t('route.pathName.embeddedDocument'),
          externalUrl: 'https://github.com/tansen87/README.md',
        },
      },
    ],
  },
];

export default externalLink;
