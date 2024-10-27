<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated style="background-color: #ddd">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title style="color: black"> КУБ </q-toolbar-title>
        <img
          src="https://sila.ru/sites/all/themes/sila/images/logo-1.svg"
          style="height: 45px"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Разделы</q-item-label>

        <q-item
          v-for="link in linksList"
          :ket="link.title"
          clickable
          tag="a"
          :href="link.link"
        >
          <q-item-section v-if="link.icon" avatar>
            <q-icon :name="link.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ link.title }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>
    <iframe
      :src="`${processEnv?.env.VUE_APP_API_URL}/#/small?documentId=1`"
      frameborder="0"
      style="
        z-index: 999;
        position: fixed;
        bottom: 0px;
        right: 0px;
        width: 100vw;
        height: 100vh;
        pointer-events: auto;
      "
    ></iframe>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { EssentialLinkProps } from 'components/EssentialLink.vue';

const processEnv = computed(() => {
  return process;
});

const linksList: EssentialLinkProps[] = [
  {
    title: 'Пользователи',
    icon: 'group',
    link: '/users',
  },
  {
    title: 'Обзор',
    icon: 'display_settings',
    link: '/overview',
  },
  {
    title: 'Бот поддержки',
    icon: 'info',
    link: '/bot',
  },
];

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
