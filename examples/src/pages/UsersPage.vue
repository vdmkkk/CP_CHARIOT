<template>
  <q-virtual-scroll
    :items="userData"
    class="chats-container"
    style="max-height: 100%"
    type="table"
  >
    <template v-slot:before>
      <thead class="thead-sticky text-left">
        <tr>
          <th v-for="col in columns" :key="'1--' + col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, index }">
      <tr :key="index">
        <td v-for="col in columns" :key="index + '-' + col.name">
          {{ row[col.prop] }}
        </td>
      </tr>
    </template>
  </q-virtual-scroll>
</template>

<script setup lang="ts">
import userData from '../assets/users.json';

const columns = [
  { name: 'ID', prop: 'id' },
  { name: 'Имя', prop: 'name' },
  { name: 'Фамилия', prop: 'surname' },
  { name: 'Роль', prop: 'role' },
  { name: 'Телефон', prop: 'phone number' },
  { name: 'E-Mail', prop: 'e-mail' },
];
</script>
