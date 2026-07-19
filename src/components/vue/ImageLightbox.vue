<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from "vue";

export interface LightboxUi {
  galleryAria: string;
  openSr: string;
  close: string;
  prev: string;
  next: string;
  dialogImage: string;
}

const props = withDefaults(
  defineProps<{
    images: string[];
    imageAlts?: string[];
    ui: LightboxUi;
  }>(),
  {
    imageAlts: () => [],
  },
);

const isOpen = ref(false);
const currentIndex = ref(0);
const dialogRef = ref<HTMLDivElement | null>(null);

function altFor(i: number): string {
  return props.imageAlts[i] ?? props.ui.dialogImage;
}

function openAt(index: number) {
  currentIndex.value = index;
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
  if (e.key === "ArrowRight" && props.images.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % props.images.length;
  }
  if (e.key === "ArrowLeft" && props.images.length > 1) {
    currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length;
  }
}

watch(isOpen, async (open) => {
  if (open) {
    await nextTick();
    dialogRef.value?.querySelector<HTMLButtonElement>("[data-lightbox-close]")?.focus();
  }
});

onMounted(() => window.addEventListener("keydown", onKeydown));
onUnmounted(() => {
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <div class="relative isolate">
    <ul class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 list-none p-0" :aria-label="ui.galleryAria">
      <li v-for="(src, i) in images" :key="`${src}-${i}`">
        <button
          type="button"
          class="gallery-stamp group relative w-full overflow-hidden bg-cream-100 aspect-4/3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50"
          @click="openAt(i)"
        >
          <img :src="src" :alt="altFor(i)" class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]" loading="lazy" />
          <span class="sr-only">{{ ui.openSr }}</span>
        </button>
      </li>
    </ul>

    <!-- No Teleport: avoids post-hydration paint/stacking glitches with body-appended nodes vs fixed header -->
    <div
      v-if="isOpen"
      ref="dialogRef"
      class="fixed inset-0 flex items-center justify-center bg-transparent p-4 pt-20 sm:p-8 sm:pt-24"
      style="z-index: 5000"
      role="dialog"
      aria-modal="true"
      :aria-label="`${ui.dialogImage} ${currentIndex + 1} / ${images.length}`"
    >
      <div class="absolute inset-0 bg-soft-900/70 backdrop-blur-sm" aria-hidden="true" @click.self="close" />
      <div
        class="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-beige-300 bg-cream-50 shadow-2xl"
      >
        <div class="flex items-center justify-between gap-3 border-b border-beige-300 bg-white px-4 py-3 sm:px-5">
          <p class="text-sm font-medium text-warm-600">{{ currentIndex + 1 }} / {{ images.length }}</p>
          <button
            type="button"
            data-lightbox-close
            class="rounded-xl border border-beige-300 bg-cream-50 px-3 py-2 text-sm font-semibold text-soft-900 hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-700"
            @click="close"
          >
            {{ ui.close }}
          </button>
        </div>
        <div class="flex flex-1 items-center justify-center bg-soft-900/5 p-4 sm:p-6 min-h-0">
          <img
            :src="images[currentIndex]"
            :alt="altFor(currentIndex)"
            class="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-lg"
          />
        </div>
        <div v-if="images.length > 1" class="flex justify-center gap-2 border-t border-beige-300 bg-white px-4 py-3">
          <button
            type="button"
            class="rounded-xl border border-beige-300 px-4 py-2 text-sm font-semibold text-soft-800 hover:bg-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-700"
            @click="currentIndex = (currentIndex - 1 + images.length) % images.length"
          >
            {{ ui.prev }}
          </button>
          <button
            type="button"
            class="rounded-xl border border-beige-300 px-4 py-2 text-sm font-semibold text-soft-800 hover:bg-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-700"
            @click="currentIndex = (currentIndex + 1) % images.length"
          >
            {{ ui.next }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
