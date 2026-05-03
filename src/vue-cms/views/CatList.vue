<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type { CatRecord } from "../api";
import { deleteCat, listCats, logout } from "../api";

const router = useRouter();
const cats = ref<CatRecord[]>([]);
const loading = ref(true);
const error = ref("");
const deleting = ref<string | null>(null);

async function load() {
  loading.value = true;
  error.value = "";
  try {
    cats.value = await listCats();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);

function confirmDelete(cat: CatRecord) {
  const ok = window.confirm(
    `Удалить кота «${cat.name}» (${cat.slug})? JSON и папка public/images/cats/${cat.slug}/ будут удалены.`,
  );
  if (!ok) return;
  void doDelete(cat.slug);
}

async function doDelete(slug: string) {
  deleting.value = slug;
  error.value = "";
  try {
    await deleteCat(slug);
    await load();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    deleting.value = null;
  }
}

async function onLogout() {
  await logout();
  window.location.href = "/cms";
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="page-head-text">
        <h1>Коты</h1>
        <p class="sub">
          Данные из <code>src/content/cats/</code>. После правок — <code>npm run build</code> в корне репозитория.
        </p>
      </div>
      <div class="head-actions">
        <button type="button" class="btn btn-touch primary" @click="router.push('/new')">Добавить кота</button>
        <button type="button" class="btn btn-touch secondary" :disabled="loading" @click="load">Обновить</button>
        <button type="button" class="btn btn-touch secondary" @click="router.push('/test-upload')">
          Тест загрузки фото
        </button>
        <button type="button" class="btn btn-touch secondary" @click="onLogout">Выйти</button>
      </div>
    </header>

    <p v-if="error" class="banner error" role="alert">{{ error }}</p>
    <p v-if="loading" class="muted">Загрузка…</p>

    <div v-else class="list-shell">
      <ul class="cat-list" role="list">
        <li v-for="c in cats" :key="c.slug" class="cat-card">
          <div class="cat-card__top">
            <img :src="c.coverImage" alt="" class="cat-card__thumb" width="80" height="60" loading="lazy" />
            <div class="cat-card__identity">
              <p class="cat-card__name">{{ c.name }}</p>
              <p class="cat-card__slug"><code>{{ c.slug }}</code></p>
            </div>
          </div>
          <div class="cat-card__meta">
            <div class="meta-block">
              <span class="meta-label">Статус</span>
              <span class="meta-value">{{ c.status }}</span>
            </div>
            <div class="meta-block">
              <span class="meta-label">Порядок</span>
              <span class="meta-value">{{ c.sortOrder ?? "—" }}</span>
            </div>
          </div>
          <div class="cat-card__actions">
            <button type="button" class="btn btn-touch secondary" @click="router.push(`/edit/${c.slug}`)">Править</button>
            <button
              type="button"
              class="btn btn-touch danger"
              :disabled="deleting === c.slug"
              @click="confirmDelete(c)"
            >
              Удалить
            </button>
          </div>
        </li>
      </ul>
      <p v-if="cats.length === 0" class="muted empty-hint">Пока нет ни одного JSON-кота.</p>
    </div>
  </div>
</template>

<style scoped>
/* Mobile-first: base = narrow touch layout; enhance from 48rem */

.page {
  width: 100%;
  margin: 0 auto;
  padding: 1rem max(0.75rem, env(safe-area-inset-left)) 2rem max(0.75rem, env(safe-area-inset-right));
  box-sizing: border-box;
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.page-head-text {
  min-width: 0;
}

h1 {
  margin: 0 0 0.35rem;
  font-size: 1.5rem;
  line-height: 1.2;
}

.sub {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #5c534a;
}

.head-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.banner.error {
  background: #fde8e8;
  color: #8b1c1c;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.muted {
  color: #6b6258;
  font-size: 0.9rem;
}

.empty-hint {
  padding: 1rem 0;
}

.list-shell {
  width: 100%;
}

.cat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cat-card {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1rem;
  border-radius: 14px;
  border: 1px solid #ddd4c8;
  background: #fffdf8;
  box-sizing: border-box;
}

.cat-card__top {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  min-width: 0;
}

.cat-card__thumb {
  width: 4.5rem;
  height: 3.375rem;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 10px;
  background: #e8e0d6;
}

.cat-card__identity {
  min-width: 0;
  flex: 1;
}

.cat-card__name {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2a221c;
  line-height: 1.25;
  word-break: break-word;
}

.cat-card__slug {
  margin: 0.25rem 0 0;
  font-size: 0.8rem;
  color: #6b6258;
  word-break: break-all;
}

.cat-card__slug code {
  font-size: 0.85em;
}

.cat-card__meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.65rem;
}

.meta-block {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.meta-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #8a8178;
}

.meta-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3d3229;
  word-break: break-word;
}

.cat-card__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.btn {
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}

.btn-touch {
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn.primary {
  background: #2f3d31;
  color: #faf6ef;
}

.btn.secondary {
  background: #fff;
  border-color: #c9bfb2;
  color: #2a2622;
}

.btn.danger {
  background: #fff;
  border-color: #c47a6a;
  color: #7a2e22;
}

/* Tablet+: roomier toolbar, optional wider page padding */
@media (min-width: 36rem) {
  .page {
    padding-left: max(1rem, env(safe-area-inset-left));
    padding-right: max(1rem, env(safe-area-inset-right));
  }

  .head-actions {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .head-actions .btn-touch {
    min-height: 2.5rem;
    width: auto;
  }
}

/* Desktop: one row per cat (no table hacks) */
@media (min-width: 48rem) {
  .page {
    padding: 1.25rem max(1.25rem, env(safe-area-inset-left)) 2.5rem max(1.25rem, env(safe-area-inset-right));
    max-width: 72rem;
  }

  .page-head {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
  }

  .page-head-text {
    flex: 1 1 18rem;
  }

  .cat-card {
    flex-direction: row;
    align-items: center;
    flex-wrap: nowrap;
    gap: 1rem 1.25rem;
    padding: 0.65rem 1rem;
  }

  .cat-card__top {
    flex: 1 1 14rem;
    min-width: 0;
    align-items: center;
  }

  .cat-card__meta {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 1.25rem;
    flex: 0 0 auto;
  }

  .meta-block {
    min-width: 5.5rem;
  }

  .meta-block:last-of-type {
    min-width: 3.5rem;
  }

  .cat-card__actions {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 0.4rem;
    margin-left: auto;
    flex: 0 0 auto;
  }

  .cat-card__actions .btn-touch {
    min-height: 2.35rem;
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
