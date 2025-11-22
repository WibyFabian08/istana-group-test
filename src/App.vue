<script setup>
import { onMounted } from "vue";
import api from "./utils/api";

onMounted(() => {
  api.get("/products").then((res) => {
    console.log(res);
  });
});
</script>

<template>
  <RouterView />
</template>
