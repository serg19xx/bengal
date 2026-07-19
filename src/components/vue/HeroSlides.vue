<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  images: string[];
  alt: string;
}>();

const index = ref(0);
let timer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  if (props.images.length < 2) return;
  timer = setInterval(() => {
    index.value = (index.value + 1) % props.images.length;
  }, 6500);
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});
</script>

<template>
  <div class="absolute inset-0" aria-hidden="true">
    <img
      v-for="(src, i) in images"
      :key="src"
      :src="src"
      :alt="i === 0 ? alt : ''"
      class="hero-photo absolute inset-0 h-full w-full object-cover object-[70%_center] transition-opacity duration-[1400ms] ease-out"
      :class="i === index ? 'opacity-100' : 'opacity-0'"
      :loading="i === 0 ? 'eager' : 'lazy'"
      :fetchpriority="i === 0 ? 'high' : 'auto'"
      width="1920"
      height="1080"
    />
  </div>
</template>
