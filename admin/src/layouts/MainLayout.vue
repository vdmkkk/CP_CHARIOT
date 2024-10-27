<template>
  <h1
    style="
      font-size: 28px;
      font-weight: 600;
      margin-left: 5%;
      margin-bottom: 0px;
    "
  >
    Админ-панель
  </h1>
  <h2
    style="
      font-size: 22px;
      font-weight: 400;
      margin-left: 5%;
      line-height: 28px;
      width: 70%;
      margin-top: 0px;
    "
  >
    {{"Здесь отображены контейнеры. Каждый контейнер представляет сервис\
    (панельуправления). В него загружается база знаний, соответствующая\
    сервису. Внутри контейнера можно получить <iframe /> на полный экран и в\
    модальном окне"}}
  </h2>
  <div class="row wrap q-ml-xl">
    <div class="container" v-for="item in containers">
      <p class="title">{{ item.name }}</p>
      <p style="margin-bottom: 10px">Отдельная страница:</p>
      <div class="code_container q-py-lg">
        <p class="code">{{ item['link_small'] }}</p>
        <q-btn
          class="copy-btn"
          flat
          round
          dense
          icon="content_copy"
          color="5C5C5C"
        />
      </div>
      <p style="margin-bottom: 10px">Модальное окно:</p>
      <div class="code_container q-py-lg">
        <p class="code">{{ item['link_big'] }}</p>
        <q-btn
          class="copy-btn"
          flat
          round
          dense
          icon="content_copy"
          color="5C5C5C"
        />
      </div>
      <div
        v-if="item['document_id'] == -1"
        style="
          background-color: #e00000;
          color: #fff;
          border-radius: 20px;
          cursor: pointer;
        "
      >
        <p
          style="
            margin: 0;
            padding-top: 10px;
            padding-bottom: 10px;
            text-align: center;
            font-weight: 600;
          "
        >
          Добавить документ
        </p>
      </div>
    </div>
  </div>
  <q-btn
    style="
      position: absolute;
      width: 50px;
      height: 50px;
      bottom: 20px;
      right: 20px;
      background-color: #e00000;
    "
    rounded
    color="#e00000"
    icon="add"
    @click="handleAdd"
  />
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

const a = [1, 2, 3, 4, 5];

const containers = ref([]);

const handleGet = () => {
  api
    .get('/container/get_all_containers')
    .then((res) => {
      console.log(res.data.containers);
      containers.value = res.data.containers;
    })
    .catch((e) => {
      console.error(e);
    });
};

const handleAdd = () => {
  api
    .post('container/create_container', {
      name: 'Новый контейнер',
      link_small: "<iframe src='test'/>'",
      link_big: "<iframe src='test/small'/>'",
    })
    .then(() => {
      handleGet();
    })
    .catch((e) => {
      console.error(e);
    });
};

onMounted(() => {
  handleGet();
});
</script>

<style lang="scss" scoped>
.container {
  background-color: #aac1d8;
  width: 300px;
  height: 340px;
  border-radius: 20px;
  margin: 50px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  scale: 1.2;
}

.title {
  font-size: 25px;
  font-weight: 600;
}

.code_container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #d9dde8;
  width: 260px;
  margin-bottom: 20px;
  height: 14px;
  // padding-top: 24px;
  // padding-bottom: 24px;
  border-radius: 10px;
  border-left: #e00000 10px solid;
}

.code {
  margin-left: 10px;
  margin-top: 15px;
  font-size: 14px;
  height: 16px;
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflowing text */
  text-overflow: ellipsis; /* Display ellipsis for overflow */
}
</style>
