<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import type { CatGender, CatStatus, GalleryItem } from "../../data/cats";

export interface GalleryBrowserUi {
  galleryAria: string;
  openSr: string;
  close: string;
  prev: string;
  next: string;
  dialogImage: string;
  searchLabel: string;
  searchPlaceholder: string;
  resultCount: string;
  emptySearch: string;
  viewProfile: string;
  contactAbout: string;
  age: string;
  gender: string;
  genderLabels: Record<CatGender, string>;
  statusLabels: Record<CatStatus, string>;
}

const props = defineProps<{
  items: GalleryItem[];
  profileBasePath: string;
  contactBasePath: string;
  ui: GalleryBrowserUi;
}>();

const query = ref("");
const isOpen = ref(false);
const currentIndex = ref(0);
const dialogRef = ref<HTMLDivElement | null>(null);

const normalizedQuery = computed(() => query.value.trim().toLocaleLowerCase());

/** Incremental name filter; exact name match → only that cat's photos. */
const filteredItems = computed(() => {
  const q = normalizedQuery.value;
  if (!q) return props.items;

  const exact = props.items.filter((item) => item.name.toLocaleLowerCase() === q);
  if (exact.length > 0) return exact;

  return props.items.filter((item) => item.name.toLocaleLowerCase().includes(q));
});

const current = computed(() => filteredItems.value[currentIndex.value] ?? null);

const resultLabel = computed(() =>
  props.ui.resultCount.replace("{count}", String(filteredItems.value.length)),
);

function profileHref(slug: string): string {
  return `${props.profileBasePath.replace(/\/$/, "")}/${slug}`;
}

function contactHref(slug: string): string {
  const base = props.contactBasePath;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}cat=${encodeURIComponent(slug)}`;
}

function openAt(index: number) {
  currentIndex.value = index;
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function step(delta: number) {
  const len = filteredItems.value.length;
  if (len < 2) return;
  currentIndex.value = (currentIndex.value + delta + len) % len;
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
  if (e.key === "ArrowRight") {
    e.preventDefault();
    step(1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    step(-1);
  }
}

watch(normalizedQuery, () => {
  currentIndex.value = 0;
  if (isOpen.value && filteredItems.value.length === 0) close();
});

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
    <div class="mb-8 max-w-md">
      <label :for="'gallery-name-search'" class="block text-sm font-medium text-soft-800 mb-2">
        {{ ui.searchLabel }}
      </label>
      <input
        id="gallery-name-search"
        v-model="query"
        type="search"
        autocomplete="off"
        spellcheck="false"
        :placeholder="ui.searchPlaceholder"
        class="w-full rounded-2xl border border-beige-300 bg-white/80 px-4 py-3 text-sm text-soft-900 placeholder:text-warm-400 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      />
      <p class="mt-2 text-xs text-warm-500">{{ resultLabel }}</p>
    </div>

    <p v-if="filteredItems.length === 0" class="text-warm-600">{{ ui.emptySearch }}</p>

    <ul v-else class="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 list-none p-0" :aria-label="ui.galleryAria">
      <li v-for="(item, i) in filteredItems" :key="`${item.slug}-${item.src}-${i}`">
        <button
          type="button"
          class="group w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 rounded-sm"
          @click="openAt(i)"
        >
          <span class="gallery-stamp relative block aspect-4/3 overflow-hidden bg-cream-100">
            <img
              :src="item.src"
              :alt="item.name"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
              loading="lazy"
            />
            <span class="sr-only">{{ ui.openSr }}</span>
          </span>
          <span class="mt-2.5 block px-0.5">
            <span class="font-serif text-lg font-semibold text-soft-900 leading-tight">{{ item.name }}</span>
            <span class="mt-0.5 block text-xs text-warm-500">
              {{ ui.genderLabels[item.gender] }}
              <span class="mx-1.5 text-warm-400" aria-hidden="true">·</span>
              {{ item.age }}
            </span>
          </span>
        </button>
      </li>
    </ul>

    <div
      v-if="isOpen && current"
      ref="dialogRef"
      class="fixed inset-0 flex items-center justify-center bg-transparent p-4 pt-20 sm:p-8 sm:pt-24"
      style="z-index: 5000"
      role="dialog"
      aria-modal="true"
      :aria-label="`${ui.dialogImage}: ${current.name}`"
    >
      <div class="absolute inset-0 bg-soft-900/70 backdrop-blur-sm" aria-hidden="true" @click="close" />
      <div
        class="relative z-10 flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-beige-300 bg-cream-50 shadow-2xl"
      >
        <div class="flex items-start justify-between gap-3 border-b border-beige-300 bg-white px-4 py-3 sm:px-5">
          <div class="min-w-0">
            <p class="font-serif text-xl font-semibold text-soft-900 truncate">{{ current.name }}</p>
            <p class="mt-0.5 text-sm text-warm-500">
              {{ ui.genderLabels[current.gender] }}
              <span class="mx-1.5 text-warm-400" aria-hidden="true">·</span>
              {{ current.age }}
              <span class="mx-1.5 text-warm-400" aria-hidden="true">·</span>
              {{ ui.statusLabels[current.status] }}
            </p>
          </div>
          <button
            type="button"
            data-lightbox-close
            class="shrink-0 rounded-xl border border-beige-300 bg-cream-50 px-3 py-2 text-sm font-semibold text-soft-900 hover:bg-cream-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            @click="close"
          >
            {{ ui.close }}
          </button>
        </div>

        <div class="flex flex-1 items-center justify-center bg-soft-900/5 p-4 sm:p-6 min-h-0">
          <img
            :src="current.src"
            :alt="current.name"
            class="max-h-[55vh] w-auto max-w-full rounded-2xl object-contain shadow-lg"
          />
        </div>

        <div
          class="flex flex-col gap-3 border-t border-beige-300 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5"
        >
          <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <a
              :href="profileHref(current.slug)"
              class="font-semibold text-soft-800 underline decoration-amber-400/70 underline-offset-4 hover:text-burgundy-700"
            >
              {{ ui.viewProfile }}
            </a>
            <a
              :href="contactHref(current.slug)"
              class="font-semibold text-burgundy-800 underline decoration-amber-400/70 underline-offset-4 hover:text-burgundy-700"
            >
              {{ ui.contactAbout }} {{ current.name }}
            </a>
          </div>
          <div v-if="filteredItems.length > 1" class="flex gap-2">
            <button
              type="button"
              class="rounded-xl border border-beige-300 px-4 py-2 text-sm font-semibold text-soft-800 hover:bg-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              @click="step(-1)"
            >
              {{ ui.prev }}
            </button>
            <button
              type="button"
              class="rounded-xl border border-beige-300 px-4 py-2 text-sm font-semibold text-soft-800 hover:bg-cream-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              @click="step(1)"
            >
              {{ ui.next }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
