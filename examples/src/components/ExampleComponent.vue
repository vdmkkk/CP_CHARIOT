<template>
  <q-page ref="pageRef" style="width: 100%" class="full-height no-scroll">
    <iframe
      class="fullscreen-frame no-scroll"
      src="http://localhost:9000"
      :style="{ height: pageHeight }"
      frameborder="0"
    ></iframe>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from 'vue';
const pageContainerRef = useTemplateRef('pageRef');
const pageHeight = ref(0);

onMounted(() => {
  pageHeight.value = pageContainerRef.value?.$el.parentElement.style.minHeight;

  const target = document.querySelector('body')?.style;
  target.overflowY = 'hidden';
});
</script>

<style lang="scss" scoped>
.fullscreen-frame {
  width: 100%;
  height: 819px;
}
</style>
