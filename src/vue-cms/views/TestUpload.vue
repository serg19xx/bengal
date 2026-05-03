<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { listTestUploads, uploadTestImage } from '../api';

const router = useRouter();
const files = ref<{ name: string; url: string }[]>([]);
const loading = ref(true);
const uploading = ref(false);
const error = ref('');
const lastUrl = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

async function loadList() {
  loading.value = true;
  error.value = '';
  try {
    files.value = await listTestUploads();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(loadList);

async function onPickChange(ev: Event) {
  const input = ev.target as HTMLInputElement;
  const f = input.files?.[0];
  input.value = '';
  if (!f) return;
  uploading.value = true;
  error.value = '';
  lastUrl.value = '';
  try {
    const url = await uploadTestImage(f);
    lastUrl.value = url;
    await loadList();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    uploading.value = false;
  }
}

function triggerPick() {
  inputRef.value?.click();
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div class="page-head-text">
        <h1>Тест загрузки фото</h1>
        <p class="sub">
          Файлы сохраняются в <code>public/images/test-uploads/</code> и отдаются как
          <code>/images/test-uploads/…</code>
        </p>
      </div>
      <div class="head-actions">
        <button type="button" class="btn secondary" @click="router.push('/')">← К списку котов</button>
      </div>
    </header>

    <p v-if="error" class="banner error" role="alert">{{ error }}</p>

    <section class="panel">
      <input
        ref="inputRef"
        type="file"
        class="sr-only"
        accept="image/jpeg,image/png,image/webp,image/gif"
        :disabled="uploading"
        @change="onPickChange"
      />
      <button type="button" class="btn primary" :disabled="uploading" @click="triggerPick">
        {{ uploading ? 'Загрузка…' : 'Выбрать файл и загрузить' }}
      </button>
      <p v-if="lastUrl" class="ok">
        Загружено:
        <a :href="lastUrl" target="_blank" rel="noopener">{{ lastUrl }}</a>
      </p>
    </section>

    <section class="panel">
      <h2>Файлы в каталоге</h2>
      <p v-if="loading" class="muted">Загрузка списка…</p>
      <ul v-else-if="files.length" class="file-list">
        <li v-for="item in files" :key="item.name">
          <a :href="item.url" target="_blank" rel="noopener">{{ item.name }}</a>
        </li>
      </ul>
      <p v-else class="muted">Пока пусто (кроме служебных файлов).</p>
    </section>
  </div>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
}

.page-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.page-head-text h1 {
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
}

.sub {
  margin: 0;
  font-size: 0.88rem;
  color: #5c534a;
}

.head-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  border-radius: 10px;
  padding: 0.5rem 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid #c9bfb2;
  background: #fffdf8;
  color: #2a2620;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #2f3d31;
  color: #faf6ef;
  border-color: #2f3d31;
}

.btn.secondary {
  font-weight: 500;
}

.banner.error {
  background: #fde8e8;
  color: #6b1c1c;
  padding: 0.65rem 0.85rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.panel {
  background: #fffdf8;
  border: 1px solid #ddd4c8;
  border-radius: 14px;
  padding: 1.1rem 1.25rem;
  margin-bottom: 1rem;
}

.panel h2 {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
}

.muted {
  color: #6b6258;
  font-size: 0.9rem;
}

.ok {
  margin: 0.85rem 0 0;
  font-size: 0.9rem;
  word-break: break-all;
}

.ok a {
  color: #1e4d8c;
}

.file-list {
  margin: 0;
  padding-left: 1.2rem;
}

.file-list li {
  margin: 0.35rem 0;
}

.file-list a {
  color: #1e4d8c;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
