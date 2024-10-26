import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'users', component: () => import('pages/UsersPage.vue') },
      { path: 'overview', component: () => import('pages/OverviewPage.vue') },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/BotLayout.vue'),
    children: [{ path: 'bot', component: () => import('pages/BotPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
