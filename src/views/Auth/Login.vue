<script setup>
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
  <h5 class="text-primary">Login View {{ userStore.user.name }}</h5>
</template>
