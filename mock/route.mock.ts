import { defineFakeRoute } from 'vite-plugin-fake-server/client';

const power = [
  {
    path: '/welcome',
    name: 'RtWelcome',
  },
  {
    path: '/command',
    name: 'Rtcommand',
    children: [
      {
        path: 'box',
        name: 'RtBox',
      },
      {
        path: 'cat',
        name: 'RtCat',
      },
      {
        path: 'count',
        name: 'RtCount',
      },
      {
        path: 'file',
        name: 'RtFile',
      },
      {
        path: 'rename',
        name: 'RtRename',
      },
      {
        path: 'cc',
        name: 'RtCatConvert',
      },
      {
        path: 'select',
        name: 'RtSelect',
      },
      {
        path: 'search',
        name: 'RtSearch',
      },
      {
        path: 'polars',
        name: 'RtPolars',
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
