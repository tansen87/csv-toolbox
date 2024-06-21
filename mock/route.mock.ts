import { defineFakeRoute } from 'vite-plugin-fake-server/client';

const power = [
  {
    path: '/welcome',
    name: 'RtWelcome',
  },
  {
    path: '/components',
    name: 'RtComponents',
    children: [
      {
        path: 'box',
        name: 'RtBox',
      },
      {
        path: 'file',
        name: 'RtFile',
      },
      {
        path: 'database',
        name: 'RtDatabase',
      },
      {
        path: 'rename',
        name: 'RtRename',
      },
    ],
  },
];

const adminPermissionRouter = [
  {
    path: '/permissions',
    name: 'RtPermissions',
    children: [
      {
        path: 'page',
        name: 'RtPermissionsPage',
      },
      {
        path: 'test-page-admin',
        name: 'RtPermissionsTestPageAdmin',
      },
    ],
  },
  {
    path: '/about',
    name: 'RtAdminInfo',
    children: [
      {
        path: '',
        name: 'RtAbout',
      },
    ],
  },
  {
    path: '/details_page',
    name: 'RtDetailsPage',
  },
];

const testPermissionRouter = [
  {
    path: '/permissions',
    name: 'RtPermissions',
    children: [
      {
        path: 'page',
        name: 'RtPermissionsPage',
      },
      {
        path: 'test-page-test',
        name: 'RtPermissionsTestPageTest',
      },
    ],
  },
];

// permissionRouter

export default defineFakeRoute([
  {
    url: '/mock_api/getRoute',
    timeout: 0,
    method: 'post',
    response: ({ body }: { body: Recordable }) => {
      const { name } = body;
      if (name == 'admin') {
        return {
          data: [...power, ...adminPermissionRouter],
          code: 1,
          message: 'ok',
        };
      } else if (name == 'test') {
        return {
          data: [...power, ...testPermissionRouter],
          code: 1,
          message: 'ok',
        };
      } else {
        return {
          data: [],
          code: -1,
          message: '账号错误',
        };
      }
    },
  },
]);
