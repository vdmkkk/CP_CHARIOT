<template>
  <q-layout>
    <q-drawer
      v-model="showChats"
      side="right"
      show-if-above
      :width="350"
      :breakpoint="700"
      overlay
      class="bg-primary text-white"
    >
      <q-virtual-scroll
        v-slot="{ item: chat }"
        :items="chats"
        class="chats-container"
        style="max-height: 100vh"
      >
        <div class="chat ellipsis-2-lines">
          {{ chat.name }}
        </div>
      </q-virtual-scroll>
    </q-drawer>
    <q-page-container>
      <q-page ref="pageContainerRef" class="row items-center justify-evenly">
        <div
          :class="
            (showChats ? 'drawer-btn-container-open' : 'drawer-btn-container') +
            ' column justify-center q-mr-lg'
          "
        >
          <q-btn
            class="drawer-btn"
            flat
            round
            dense
            :icon="showChats ? 'chevron_left' : 'chevron_right'"
            @click="showChats = !showChats"
          />
        </div>
        <q-virtual-scroll
          v-slot="{ item: message }"
          :items="messages"
          class="message-container"
          style="max-height: 100vh"
        >
          <div :class="message.from == 'user' ? 'message-user' : 'message-bot'">
            <h1 v-if="message.from == 'bot'">Ответ SILA.Bot:</h1>
            {{ message.message }}
          </div>
        </q-virtual-scroll>
        <q-input
          v-model="userInput"
          class="user-input absolute-bottom q-mb-lg"
          input-class="text-area"
          outlined
          rounded
          autogrow
        >
          <template v-slot:append class="row">
            <q-btn round flat class="btn" icon="attach_file" />
            <q-btn round flat class="btn" icon="send" />
          </template>
        </q-input>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, useTemplateRef, onMounted } from 'vue';
import messageData from '../assets/messages.json';
import chatsData from '../assets/chats.json';
const showChats = ref(true);
const userInput = ref('');

const pageContainerRef = useTemplateRef('pageContainerRef');
const pageHeight = ref(0);

// onMounted(() => {
//   console.log(pageContainerRef.value.$el.offsetHeight);
//   pageHeight.value = `${pageContainerRef.value.offsetHeight}px`;
// });

const messages = computed(() => {
  return messageData;
});

const chats = computed(() => {
  return chatsData;
});
</script>

<style lang="scss" scoped>
.chats-container {
  padding-top: 20px;
  padding-left: 5%;
  padding-right: 5%;

  .chat {
    margin-bottom: 20px;
  }
}

.message-container {
  position: absolute;
  top: 0;
  padding-top: 50px;
  padding-left: calc(10% + 190px);
  padding-right: calc(10% + 190px);
  font-size: 20px;
  padding-bottom: 100px;

  .message-user,
  .message-bot {
    margin-bottom: 30px;
  }

  .message-user {
    font-weight: 300;
  }

  .message-bot {
    h1 {
      font-size: 24px;
      line-height: 36px;
    }
    font-weight: 400;
    p {
      margin: 0;
    }
  }
}

:global(.text-area) {
  padding: 0;
  margin-left: 20px;
}
.user-input {
  width: calc(75% - 380px);
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 30px;

  .btn {
    width: 20px;
    height: 20px;
  }
}

.drawer-btn-container,
.drawer-btn-container-open {
  position: absolute;
  right: 0px;
  height: 100vh;
  width: min-content;
  z-index: 2;
}
.drawer-btn-container-open {
  right: 350px;
}

.drawer-btn {
  width: 30px;
  height: 30px;
}
</style>
