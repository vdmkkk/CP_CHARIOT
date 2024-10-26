<template>
  <q-page class="q-pa-md">
    <div
      class="row justify-between items-center q-pa-lg"
      style="background-color: #f4f4f4; border-radius: 20px"
    >
      <div>
        <div style="font-weight: 600; font-size: 18px; color: #222e58">
          Дата и время ВМС
        </div>
        <div style="font-size: 14px; color: #222e58">
          2023-09-13 19:14:32 (UTC+3)
        </div>
      </div>
      <q-btn
        color="d2dadd"
        text-color="222e58"
        label="Консоль SOL"
        icon="arrow_forward"
      />
    </div>

    <div class="q-mt-md">
      <q-card class="q-mb-md no-shadow">
        <q-card-section>
          <div class="text-h6">Информация о системе</div>
        </q-card-section>
        <div class="row justify-between" style="row-gap: 30px">
          <q-card
            style="background-color: #f4f4f4; border-radius: 20px; width: 49%"
          >
            <q-card-section>
              <div class="text-subtitle1">Информация о сервере</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Модель:
              </div>
              <div>CP2-5422</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Серийный номер:
              </div>
              <div>------</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Подробнее" color="red" />
            </q-card-actions>
          </q-card>
          <q-card
            style="background-color: #f4f4f4; border-radius: 20px; width: 49%"
          >
            <q-card-section>
              <div class="text-subtitle1">Информация о встроенном ПО</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Рабочий: --
              </div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Резервный: --
              </div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Подробнее" color="red" />
            </q-card-actions>
          </q-card>
          <q-card
            style="background-color: #f4f4f4; border-radius: 20px; width: 49%"
          >
            <q-card-section>
              <div class="text-subtitle1">Сетевые интерфейсы</div>
              <div
                style="font-weight: 600; font-size: 16px; color: #222e58"
                class="text-subtitle1"
              >
                Имя хоста:
              </div>
              <div>CP2-5422</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Состояние линка:
              </div>
              <div>LinkUp</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                IPv4:
              </div>
              <div>-----</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Подробнее" color="red" />
            </q-card-actions>
          </q-card>
        </div>
      </q-card>

      <q-card class="q-mb-md no-shadow">
        <q-card-section>
          <div class="text-h6">Информация о статусе</div>
        </q-card-section>
        <div class="row justify-between" style="row-gap: 30px">
          <q-card
            style="background-color: #f4f4f4; border-radius: 20px; width: 49%"
          >
            <q-card-section>
              <div class="text-subtitle1">Журнал событий</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Критические:
              </div>
              <div>0</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Предупреждения:
              </div>
              <div>3861</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Подробнее" color="red" />
            </q-card-actions>
          </q-card>
          <q-card
            style="background-color: #f4f4f4; border-radius: 20px; width: 49%"
          >
            <q-card-section>
              <div class="text-subtitle1">Перечень оборудования и LED</div>
              <div style="font-weight: 600; font-size: 16px; color: #222e58">
                Идентификационный LED системы
              </div>
              <div>выкл</div>
            </q-card-section>
            <q-card-actions align="right">
              <q-btn flat label="Подробнее" color="red" />
            </q-card-actions>
          </q-card>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
// No additional script logic needed for static layout
</script>

<style scoped>
/* Add any custom styles here */
</style>
