<template>
  <h1>админ панель</h1>
  <div class="row wrap justify-between">
  <div class="container" v-for="item in a">
    <p class="title">КУБ</p>
    <div class="code_container">
      <p class="code">your code here</p>
      <q-btn
        class="copy-btn"
        flat
        round
        dense
        icon="content_copy"
        color="5C5C5C"
      />
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
  const a = [1, 2, 3, 4, 5]
</script>

<style lang="scss" scoped>
.container {
  background-color: #82A9D1;
  width: 200px;
  height: 150px;
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
  justify-content: space-evenly;
  align-items: center;
  background-color: #D9DDE8;
  width: 160px;
  height: 50px;
  border-radius: 10px;
  border-left: #E00000 10px solid;
}

.code {
  margin-top: 15px;
}
</style>