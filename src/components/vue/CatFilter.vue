<script setup lang="ts">
import { computed, ref } from "vue";
import type { Cat, CatGender, CatStatus } from "../../data/cats";
import { displayAgeLine, formatCatBirthDate, pickLocalized } from "../../data/cats";
import type { Locale } from "../../i18n/config";

export interface CatFilterUi {
  aria: string;
  breed: string;
  gender: string;
  status: string;
  allBreeds: string;
  allGenders: string;
  allStatuses: string;
  male: string;
  female: string;
  available: string;
  reserved: string;
  sold: string;
  notForSale: string;
  countOne: string;
  countMany: string;
  emptyTitle: string;
  emptyHint: string;
  age: string;
  birthDate: string;
  genderDd: string;
  viewProfile: string;
  statusLabels: Record<CatStatus, string>;
  genderLabels: Record<CatGender, string>;
}

const props = defineProps<{
  cats: Cat[];
  locale: Locale;
  basePath: string;
  ui: CatFilterUi;
}>();

const breedFilter = ref<string>("all");
const genderFilter = ref<"all" | CatGender>("all");
const statusFilter = ref<"all" | CatStatus>("all");

const breedOptions = computed(() => {
  const keys = [...new Set(props.cats.map((c) => c.breed.en))].sort();
  return keys.map((key) => {
    const sample = props.cats.find((c) => c.breed.en === key)!;
    return { value: key, label: pickLocalized(sample.breed, props.locale) };
  });
});

function catHref(slug: string): string {
  return `${props.basePath.replace(/\/$/, "")}/${slug}`;
}

function tBreed(cat: Cat): string {
  return pickLocalized(cat.breed, props.locale);
}

function tAge(cat: Cat): string {
  return displayAgeLine(cat, props.locale);
}

function hasBirthDate(cat: Cat): boolean {
  return Boolean(cat.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(cat.birthDate));
}

function ageRowLabel(cat: Cat): string {
  return hasBirthDate(cat) ? props.ui.birthDate : props.ui.age;
}

function ageRowValue(cat: Cat): string {
  return hasBirthDate(cat) ? formatCatBirthDate(cat.birthDate!, props.locale) : tAge(cat);
}

function tShort(cat: Cat): string {
  return pickLocalized(cat.personalityShort, props.locale);
}

const filteredCats = computed(() => {
  return props.cats.filter((cat) => {
    if (breedFilter.value !== "all" && cat.breed.en !== breedFilter.value) return false;
    if (genderFilter.value !== "all" && cat.gender !== genderFilter.value) return false;
    if (statusFilter.value !== "all" && cat.status !== statusFilter.value) return false;
    return true;
  });
});

const statusStyles: Record<CatStatus, string> = {
  Available: "bg-emerald-100 text-emerald-900 border-emerald-200/80",
  Reserved: "bg-amber-100 text-amber-950 border-amber-200/80",
  Sold: "bg-warm-400/30 text-warm-600 border-warm-400/50",
  "Not for sale": "bg-cream-200 text-soft-800 border-beige-300",
};

const countLabel = computed(() => {
  const n = filteredCats.value.length;
  if (n === 1) return props.ui.countOne;
  return props.ui.countMany.replace("{n}", String(n));
});
</script>

<template>
  <div>
    <div
      class="flex flex-col gap-4 rounded-3xl border border-beige-300/70 bg-white p-5 sm:p-6 sm:flex-row sm:flex-wrap sm:items-end"
      role="search"
      :aria-label="ui.aria"
    >
      <div class="flex flex-col gap-1.5 min-w-[160px] flex-1">
        <label for="filter-breed" class="text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.breed }}</label>
        <select
          id="filter-breed"
          v-model="breedFilter"
          class="rounded-2xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm font-medium text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
        >
          <option value="all">{{ ui.allBreeds }}</option>
          <option v-for="b in breedOptions" :key="b.value" :value="b.value">{{ b.label }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5 min-w-[140px] flex-1">
        <label for="filter-gender" class="text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.gender }}</label>
        <select
          id="filter-gender"
          v-model="genderFilter"
          class="rounded-2xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm font-medium text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
        >
          <option value="all">{{ ui.allGenders }}</option>
          <option value="Male">{{ ui.male }}</option>
          <option value="Female">{{ ui.female }}</option>
        </select>
      </div>
      <div class="flex flex-col gap-1.5 min-w-[160px] flex-1">
        <label for="filter-status" class="text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.status }}</label>
        <select
          id="filter-status"
          v-model="statusFilter"
          class="rounded-2xl border border-beige-300 bg-cream-50 px-4 py-2.5 text-sm font-medium text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
        >
          <option value="all">{{ ui.allStatuses }}</option>
          <option value="Available">{{ ui.available }}</option>
          <option value="Reserved">{{ ui.reserved }}</option>
          <option value="Sold">{{ ui.sold }}</option>
          <option value="Not for sale">{{ ui.notForSale }}</option>
        </select>
      </div>
      <p class="text-sm text-warm-600 sm:ml-auto sm:self-center" aria-live="polite">
        {{ countLabel }}
      </p>
    </div>

    <div
      v-if="filteredCats.length === 0"
      class="mt-10 rounded-3xl border border-dashed border-beige-300 bg-cream-100 px-6 py-12 text-center"
    >
      <p class="font-medium text-soft-900">{{ ui.emptyTitle }}</p>
      <p class="mt-2 text-sm text-warm-600">{{ ui.emptyHint }}</p>
    </div>

    <ul v-else class="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 list-none p-0">
      <li v-for="cat in filteredCats" :key="cat.slug">
        <article
          class="group flex h-full flex-col overflow-hidden rounded-3xl border border-beige-300/70 bg-white shadow-sm transition hover:shadow-md hover:border-beige-300"
        >
          <a :href="catHref(cat.slug)" class="relative block aspect-4/3 overflow-hidden bg-cream-100">
            <img
              :src="cat.coverImage"
              :alt="`${cat.name}, ${tBreed(cat)}`"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              width="800"
              height="600"
              loading="lazy"
            />
            <span
              class="absolute right-3 top-3 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm"
              :class="statusStyles[cat.status]"
            >
              {{ ui.statusLabels[cat.status] }}
            </span>
          </a>
          <div class="flex flex-1 flex-col p-5 sm:p-6">
            <h3 class="font-serif text-xl font-semibold text-soft-900">
              <a :href="catHref(cat.slug)" class="hover:text-soft-700 transition">{{ cat.name }}</a>
            </h3>
            <p class="mt-1 text-sm text-warm-500">{{ tBreed(cat) }}</p>
            <p class="mt-3 text-sm leading-relaxed text-warm-600 line-clamp-3">{{ tShort(cat) }}</p>
            <dl class="mt-4 grid grid-cols-2 gap-2 text-xs text-warm-500">
              <div>
                <dt class="font-medium text-warm-600">{{ ageRowLabel(cat) }}</dt>
                <dd>{{ ageRowValue(cat) }}</dd>
              </div>
              <div>
                <dt class="font-medium text-warm-600">{{ ui.genderDd }}</dt>
                <dd>{{ ui.genderLabels[cat.gender] }}</dd>
              </div>
            </dl>
            <div class="mt-5 flex flex-1 flex-col justify-end border-t border-cream-200 pt-4">
              <a :href="catHref(cat.slug)" class="inline-flex items-center gap-1 text-sm font-semibold text-soft-800 hover:text-soft-700">
                {{ ui.viewProfile }} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>
