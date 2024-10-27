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
          :items="chats"
          class="chats-container"
          :style="{ 'max-height': `${height}px` }"
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
            <div class="chat ellipsis-2-lines">
              {{ chat.name }}
            </div>
          </template>
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
          <div v-if="!loadingResponse">
            <q-virtual-scroll
              v-if="selectedChat != -1"
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
            <div v-else>
              <p style="text-align: center; font-size: 26px; font-weight: 600">
                Новый чат
              </p>
              <p style="text-align: center; font-size: 14px; font-weight: 100">
                Задайте интересующий Вас вопрос
              </p>
            </div>
          </div>
          <div v-else>
            <q-inner-loading />
          </div>

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
import { ref, computed, onMounted, watch } from 'vue';

import { debounce } from 'lodash';
import { api } from 'src/boot/axios';
// import { useRoute } from 'vue-router';

const isExpanded = ref(false);
const width = 350;
const height = 500;

// const route = useRoute();

watch(isExpanded, () => {
  const target = document.getElementsByClassName('q-drawer__opener');
  console.log(target);
});

const showChats = ref(true);
const userInput = ref('');

const messages = ref([]);

const chats = ref([]);
const selectedChat = ref(-1);
const loadingResponse = ref(false);

const getChats = () => {
  api
    .get('/get_chats')
    .then((res) => {
      chats.value = res.data;
    })
    .catch((e) => {
      console.error(e);
    });
};

const mode = ref('');

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
  getChats();
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

  .create-chat {
    background-color: #575757;
    cursor: pointer;
    user-select: none;
  }

  .create-chat:hover {
    background-color: #494949;
  }

  .chat {
    margin-bottom: 16px;
    font-size: 14px;
    font-weight: 600;
  }

  .chat:hover {
    background-color: #614e4e;
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
