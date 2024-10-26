<template>
  <q-layout>
    <q-drawer
      v-model="showChats"
      side="right"
      show-if-above
      :width="350"
      :breakpoint="700"
      class="text-white"
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
          ref="inputRef"
          @keydown.tab.prevent="acceptSuggestion"
          @update:model-value="onInput"
        >
          <template v-slot:append>
            <span v-if="suggestedText" class="suggestion-text">
              {{ suggestedText }}
            </span>
            <!-- <q-btn round flat class="btn" icon="attach_file" /> -->
            <q-btn round flat class="btn" icon="send" />
          </template>
        </q-input>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import messageData from '../assets/messages.json';
import chatsData from '../assets/chats.json';
import { useRoute } from 'vue-router';

import { debounce } from 'lodash'; // Use lodash-es or any debounce utility
import { useQuasar } from 'quasar';

const route = useRoute();

const showChats = ref(true);
const userInput = ref('');

const messages = computed(() => {
  return messageData;
});

const chats = computed(() => {
  return chatsData;
});

const mode = ref('');

const inputRef = ref(null);

// Reactive data properties
const debounceduserInput = ref(''); // Debounced input value
const suggestion = ref(''); // Full suggested text
const abortController = ref(null); // For cancelling requests

// Debounce the input to prevent multiple rapid API calls
const debouncedUpdateuserInput = debounce(() => {
  debounceduserInput.value = userInput.value;
  console.log(debounceduserInput.value);
}, 500); // Adjust the debounce delay as needed (e.g., 500ms)

function onInput() {
  console.log('allo');
  debouncedUpdateuserInput();
}

// Watch the debounced input value to fetch suggestions
watch(debounceduserInput, async (newValue) => {
  if (abortController.value) {
    // Cancel previous request
    abortController.value.abort();
  }

  // Create a new AbortController for the current request
  abortController.value = new AbortController();
  const signal = abortController.value.signal;

  try {
    // Fetch suggestion from the backend
    const result = await getSuggestion(newValue, signal);
    suggestion.value = result;
  } catch (error) {
    if (error.name === 'AbortError') {
      // Request was aborted, do nothing
      console.log('Previous request was cancelled.');
    } else {
      // Handle other errors
      console.error('Error fetching suggestion:', error);
    }
    suggestion.value = '';
  }
});

// Function to fetch suggestion from the backend
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

// Compute the suggested text to display after the user's input
const suggestedText = computed(() => {
  // if (suggestion.value && suggestion.value.startsWith(userInput.value)) {
  // return suggestion.value.substring(userInput.value.length);
  // }
  // return '';
  return suggestion.value;
});

// Function to accept the suggestion when Tab is pressed
function acceptSuggestion() {
  if (suggestedText.value) {
    userInput.value += suggestion.value;
    suggestion.value = '';
    // Move the cursor to the end of the input
    // nextTick(() => {
    //   inputRef.value.focus();
    // });
  }
}

onMounted(() => {
  const query = route.query;
  mode.value = query.mode as string;
});
</script>

<style lang="scss" scoped>
.chats-container {
  padding-top: 20px;
  padding-left: 5%;
  padding-right: 5%;

  background-color: #696969;
  height: 100vh;

  .chat {
    margin-bottom: 20px;
  }
}

.message-container {
  position: absolute;
  top: 0;
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
