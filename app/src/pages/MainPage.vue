<template>
  <q-layout>
    <q-drawer
      v-model="showChats"
      side="right"
      show-if-above
      :width="350"
      :breakpoint="700"
      class="text-white"
      style="background-color: #696969"
    >
      <q-virtual-scroll
        v-if="!loadingChats"
        :items="chats.toReversed()"
        class="chats-container"
        style="max-height: 100vh"
      >
        <template v-slot:before
          ><div
            class="create-chat"
            style="
              border-radius: 14px;
              display: flex;
              flex-direction: row;
              margin-bottom: 20px;
            "
            @click="messages.length == 0 ? () => {} : newChat"
          >
            <p
              style="
                height: 47px;
                width: 28px;
                margin: 0;
                font-size: 25px;
                line-height: 47px;
                margin-left: 15px;
                font-weight: 600;
              "
            >
              +
            </p>
            <p
              style="
                margin: 0;
                padding-top: 10px;
                padding-bottom: 10px;
                font-size: 18px;
                text-align: center;
              "
            >
              Новый чат
            </p>
          </div></template
        >
        <template v-slot="{ item: chat }">
          <div
            class="chat ellipsis-2-lines q-pa-md"
            @click="
              selectedChat = chat.id;
              messages = [];
              userInput = '';
              getChatHistory();
            "
          >
            {{ chat.last_message.split('\n')[0].replace('Вопрос: ', '') }}
          </div>
        </template>
      </q-virtual-scroll>
      <q-inner-loading :showing="loadingChats">
        <q-spinner-gears size="50px" style="color: #e00000" />
      </q-inner-loading>
    </q-drawer>
    <q-page-container>
      <q-page class="row items-center justify-evenly">
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
        <div v-if="!loadingResponse">
          <q-virtual-scroll
            v-if="messages.length != 0"
            v-slot="{ item: message }"
            :items="messages"
            class="message-container"
            style="max-height: 100vh"
          >
            <div
              :class="message.from == 'user' ? 'message-user' : 'message-bot'"
            >
              <h1 v-if="message.from == 'bot'">Ответ SILA.Bot:</h1>
              {{ message.text }}
            </div>
          </q-virtual-scroll>
          <div v-else>
            <p style="text-align: center; font-size: 30px; font-weight: 600">
              Новый чат
            </p>
            <p style="text-align: center; font-size: 16px; font-weight: 100">
              Задайте интересующий Вас вопрос
            </p>
          </div>
        </div>
        <q-inner-loading :showing="loadingChats" v-else>
          <q-spinner-gears size="50px" style="color: #e00000" />
        </q-inner-loading>

        <q-input
          v-model="userInput"
          class="user-input absolute-bottom q-mb-lg"
          input-class="text-area"
          outlined
          rounded
          autogrow
          ref="inputRef"
          @keydown.tab.prevent="acceptSuggestion"
          @keydown.enter.prevent="sendMessage"
          @update:model-value="onInput"
        >
          <template v-slot:append>
            <span v-if="suggestedText" class="suggestion-text">
              {{ suggestedText }}
            </span>
            <!-- <q-btn round flat class="btn" icon="attach_file" /> -->
            <q-btn round flat class="btn" icon="send" @click="sendMessage" />
          </template>
        </q-input>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';

import { debounce } from 'lodash';
import { api } from 'src/boot/axios';

const documentId = ref();

const showChats = ref(true);
const userInput = ref('');

const messages = ref([]);

const chats = ref([]);
const selectedChat = ref(-1);
const loadingResponse = ref(false);
const loadingChats = ref(false);

const sendMessage = async () => {
  messages.value.push({ text: userInput.value, from: 'user' });
  if (selectedChat.value == -1) {
    await newChat();
  }
  api
    .post('/get_answer', {
      query: userInput.value,
      chat_id: selectedChat.value,
      user_id: '1',
    })
    .then((res) => {
      messages.value.push({ text: res.data.answer, from: 'bot' });
      userInput.value = '';
    });
};

const getChatHistory = () => {
  let meow;
};

const newChat = async () => {
  await api
    .post('/create_chat', {
      user_id: '1',
      document_id: documentId.value.toString(),
    })
    .then((res) => {
      console.log(res.data);
      selectedChat.value = res.data['chat_id'];
      chats.value.push({
        chat_id: res.data['chat_id'],
        last_message: 'Новый чат',
      });
      // getChats();
    })
    .catch((e) => {
      console.error(e);
    });
};

const getChats = () => {
  loadingChats.value = true;
  api
    .get('/get_chats')
    .then((res) => {
      chats.value = res.data;
      loadingChats.value = false;
    })
    .catch((e) => {
      console.error(e);
    });
};

const inputRef = ref(null);

const debounceduserInput = ref('');
const suggestion = ref('');
const abortController = ref(null);

const debouncedUpdateuserInput = debounce(() => {
  debounceduserInput.value = userInput.value;
  console.log(debounceduserInput.value);
});

function onInput() {
  console.log('allo');
  debouncedUpdateuserInput();
}

watch(debounceduserInput, async (newValue) => {
  if (abortController.value) {
    abortController.value.abort();
  }

  abortController.value = new AbortController();
  const signal = abortController.value.signal;

  try {
    const result = await getSuggestion(newValue, signal);
    suggestion.value = result;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Previous request was cancelled.');
    } else {
      console.error('Error fetching suggestion:', error);
    }
    suggestion.value = '';
  }
});

async function getSuggestion(inputText, signal) {
  // Replace this with your actual API endpoint and request
  // Example using fetch with AbortController support
  // const response = await fetch('/api/suggestion', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ text: inputText }),
  //   signal: signal, // Pass the signal to support cancellation
  // });

  // if (!response.ok) {
  //   throw new Error('Network response was not ok');
  // }

  // const data = await response.json();
  // return data.suggestion; // Adjust based on your API response structure
  return 'aboba';
}

const suggestedText = computed(() => {
  // if (suggestion.value && suggestion.value.startsWith(userInput.value)) {
  // return suggestion.value.substring(userInput.value.length);
  // }
  // return '';
  return suggestion.value;
});

function acceptSuggestion() {
  if (suggestedText.value) {
    userInput.value += suggestion.value;
    suggestion.value = '';
  }
}

onMounted(() => {
  const searchParams = new URLSearchParams(window.location.search);

  // Iterate over the search parameters and store them in the reactive object
  searchParams.forEach((value, key) => {
    if (key == 'documentId') {
      documentId.value = value;
    }
  });
  getChats();
});
</script>

<style lang="scss" scoped>
.chats-container {
  padding-top: 20px;
  padding-left: 5%;
  padding-right: 5%;

  background-color: #696969;
  height: 100vh;

  .create-chat {
    background-color: #575757;
    cursor: pointer;
    user-select: none;
  }

  .create-chat:hover {
    background-color: #494949;
  }

  .chat {
    height: 72px;
    cursor: pointer;
    white-space: wrap;
    overflow: hidden;
    font-size: 18px;
    line-height: 24px;
    user-select: none;
  }

  .chat:hover {
    background-color: #614e4e;
  }
}

.message-container {
  position: absolute;
  top: 0;
  left: 0;
  padding-top: 50px;
  padding-left: 10%;
  padding-right: 10%;
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
  height: 100vh;
  width: min-content;
  z-index: 2;
}

.drawer-btn {
  width: 30px;
  height: 30px;
}
</style>
