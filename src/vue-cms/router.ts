import { createRouter, createWebHistory } from 'vue-router';
import CatEditor from './views/CatEditor.vue';
import CatList from './views/CatList.vue';
import TestUpload from './views/TestUpload.vue';

export const cmsRouter = createRouter({
  history: createWebHistory('/cms'),
  routes: [
    { path: '/', name: 'CatList', component: CatList },
    { path: '/test-upload', name: 'TestUpload', component: TestUpload },
    { path: '/new', name: 'CatNew', component: CatEditor },
    { path: '/edit/:slug', name: 'CatEdit', component: CatEditor, props: true },
  ],
});
