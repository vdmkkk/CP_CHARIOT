<template>
  <q-page ref="pageRef" style="width: 100%" class="full-height no-scroll">
    <iframe
      class="fullscreen-frame no-scroll"
      :src="`${processEnv?.env.VUE_APP_API_URL}?documentId=1`"
      :style="{ height: pageHeight }"
      frameborder="0"
    ></iframe>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
const pageContainerRef = useTemplateRef('pageRef');
const pageHeight = ref(0);

const processEnv = computed(() => {
  return process;
});

onMounted(() => {
  pageHeight.value = pageContainerRef.value?.$el.parentElement.style.minHeight;

  const target = document.querySelector('body')?.style;
  target!.overflowY = 'hidden';
});
</script>

<style lang="scss" scoped>
.fullscreen-frame {
  width: 100%;
}
</style>
