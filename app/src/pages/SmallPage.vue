<template class="overflow-hidden page-container">
  <div
    :class="['square', { expanded: isExpanded }]"
    class="overflow-hidden popup"
    @click.stop="isExpanded = true"
  >
    <span v-if="!isExpanded">?</span>
    <q-layout
      container
      :style="{
        'max-height': `${height}px`,
        'min-height': 0,
        overflow: 'hidden',
      }"
      v-else
    >
      <q-drawer
        v-model="showChats"
        side="right"
        show-if-above
        :width="350"
        :breakpoint="700"
        class="text-white"
        style="background-color: #696969"
      >
        <q-btn
          flat
          rounded
          dense
          icon="close"
          style="margin-left: 4%; margin-top: 10px; position: absolute"
          @click.stop="showChats = false"
        />
        <q-virtual-scroll
          v-slot="{ item: chat }"
          :items="chats"
          class="chats-container"
          :style="{ 'max-height': `${height}px` }"
        >
          <div class="chat ellipsis-2-lines">
            {{ chat.name }}
          </div>
        </q-virtual-scroll>
      </q-drawer>
      <q-page-container>
        <q-page class="row items-center justify-evenly">
          <q-btn
            flat
            rounded
            dense
            icon="close"
            class="fixed-top-left"
            style="z-index: 2; margin-left: 10px; margin-top: 10px"
            @click.stop="isExpanded = false"
          />

          <div class="drawer-btn-container column justify-center q-mr-lg">
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
            <div
              :class="message.from == 'user' ? 'message-user' : 'message-bot'"
            >
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
            <template v-slot:append>
              <!-- <q-btn round flat class="btn" icon="attach_file" /> -->
              <q-btn round flat class="btn" icon="send" />
            </template>
          </q-input>
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import messageData from '../assets/messages.json';
import chatsData from '../assets/chats.json';
// import { useRoute } from 'vue-router';

const isExpanded = ref(false);
const width = 350;
const height = 500;

// const route = useRoute();

const showChats = ref(false);
const userInput = ref('');

const messages = computed(() => {
  return messageData;
});

const chats = computed(() => {
  return chatsData;
});

watch(isExpanded, () => {
  const target = document.getElementsByClassName('q-drawer__opener');
  console.log(target);
});
</script>

<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100%;
}

.popup {
  position: absolute;
  right: 20px;
  bottom: 20px;
}

.square {
  width: 70px;
  height: 70px;
  background-color: #fc0000;
  font-size: 30px;
  font-weight: 800;
  color: white;
  display: flex;
  user-select: none;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 40%;
}

.square.expanded {
  width: calc(v-bind(width) * 1px);
  height: calc(v-bind(height) * 1px);
  border-radius: 10px;
  background-color: white;
  color: black;
  border: 2px solid #000;
}

.chats-container {
  padding-top: 50px;
  padding-left: 5%;
  padding-right: 5%;
  height: calc(v-bind(height) * 1px - 5px);

  .chat {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
  }
}

.message-container {
  position: absolute;
  top: 0;
  padding-top: 50px;
  padding-left: 10%;
  padding-right: 10%;
  font-size: 14px;
  padding-bottom: 100px;
  height: calc(v-bind(height) * 1px - 5px);

  .message-user,
  .message-bot {
    margin-bottom: 30px;
  }

  .message-user {
    font-weight: 300;
  }

  .message-bot {
    h1 {
      font-size: 20px;
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
  width: 75%;
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 30px;

  .btn {
    width: 20px;
    height: 20px;
  }
}

.drawer-btn-container {
  position: absolute;
  right: 0px;
  height: calc(v-bind(height) * 1px - 5px);
  width: min-content;
  z-index: 2;
}

.drawer-btn {
  width: 30px;
  height: 30px;
}
</style>
