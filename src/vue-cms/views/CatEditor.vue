<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { CatRecord, Localized } from "../api";
import { deleteCatImage, getCat, saveCat, uploadCatImage } from "../api";
import { approximateAgeFromBirth } from "../lib/agePreview";
import ImageCropModal from "../components/ImageCropModal.vue";

/** Form state: `birthDate` and `vetNotes` always present for inputs. */
interface CatEditorForm extends Omit<CatRecord, "birthDate" | "vetNotes"> {
  birthDate: string;
  vetNotes: Localized;
}

const PLACEHOLDER = "/images/cats/placeholder-1.svg";

const route = useRoute();
const router = useRouter();

const isNew = computed(() => route.name === "CatNew");
const slugParam = computed(() => (typeof route.params.slug === "string" ? route.params.slug : ""));

const loading = ref(true);
const saving = ref(false);
const error = ref("");
const cropOpen = ref(false);
const showTech = ref(false);

const form = reactive<CatEditorForm>({
  slug: "",
  sortOrder: 100,
  name: "",
  breed: { en: "Bengal", fr: "Bengal" },
  age: { en: "—", fr: "—" },
  gender: "Female",
  personalityShort: { en: "", fr: "" },
  personality: { en: "", fr: "" },
  status: "Available",
  featured: false,
  coverImage: PLACEHOLDER,
  gallery: [PLACEHOLDER],
  healthNote: { en: "", fr: "" },
  parentsNote: { en: "", fr: "" },
  birthDate: "",
  vetNotes: { en: "", fr: "" },
});

const canUpload = computed(() => !isNew.value && Boolean(slugParam.value));

const agePreviewEn = computed(() =>
  form.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)
    ? approximateAgeFromBirth(form.birthDate, "en")
    : "—",
);
const agePreviewFr = computed(() =>
  form.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)
    ? approximateAgeFromBirth(form.birthDate, "fr")
    : "—",
);

watch(
  () => form.birthDate,
  () => {
    if (form.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) {
      form.age = {
        en: approximateAgeFromBirth(form.birthDate, "en"),
        fr: approximateAgeFromBirth(form.birthDate, "fr"),
      };
    }
  },
);

function payloadForSave(): CatRecord {
  const slug = form.slug.trim();
  const base: CatRecord = {
    slug,
    sortOrder: Number(form.sortOrder) || 999,
    name: form.name.trim(),
    breed: { en: form.breed.en.trim() || "Bengal", fr: form.breed.fr.trim() || "Bengal" },
    age: {
      en: form.age.en.trim() || "—",
      fr: form.age.fr.trim() || "—",
    },
    gender: form.gender,
    personalityShort: { en: form.personalityShort.en.trim(), fr: form.personalityShort.fr.trim() },
    personality: { en: form.personality.en.trim(), fr: form.personality.fr.trim() },
    status: form.status,
    featured: form.featured,
    coverImage: form.coverImage.trim(),
    gallery: [...form.gallery],
    healthNote: { en: form.healthNote.en.trim(), fr: form.healthNote.fr.trim() },
    parentsNote: { en: form.parentsNote.en.trim(), fr: form.parentsNote.fr.trim() },
  };
  if (form.birthDate && /^\d{4}-\d{2}-\d{2}$/.test(form.birthDate)) {
    base.birthDate = form.birthDate;
    base.age = {
      en: approximateAgeFromBirth(form.birthDate, "en"),
      fr: approximateAgeFromBirth(form.birthDate, "fr"),
    };
  }
  const ven = form.vetNotes?.en?.trim() ?? "";
  const vrf = form.vetNotes?.fr?.trim() ?? "";
  if (ven || vrf) {
    base.vetNotes = { en: ven, fr: vrf };
  }
  return base;
}

async function load() {
  loading.value = true;
  error.value = "";
  try {
    if (isNew.value) {
      form.slug = "";
      form.name = "";
      form.sortOrder = 100;
      form.breed = { en: "Bengal", fr: "Bengal" };
      form.age = { en: "—", fr: "—" };
      form.gender = "Female";
      form.personalityShort = { en: "", fr: "" };
      form.personality = { en: "", fr: "" };
      form.status = "Available";
      form.featured = false;
      form.coverImage = PLACEHOLDER;
      form.gallery = [PLACEHOLDER];
      form.healthNote = { en: "", fr: "" };
      form.parentsNote = { en: "", fr: "" };
      form.birthDate = "";
      form.vetNotes = { en: "", fr: "" };
    } else {
      const cat = await getCat(slugParam.value);
      Object.assign(form, {
        ...cat,
        birthDate: cat.birthDate ?? "",
        vetNotes: cat.vetNotes ?? { en: "", fr: "" },
      });
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);

watch(
  () => route.fullPath,
  () => {
    void load();
  },
);

async function onSave() {
  saving.value = true;
  error.value = "";
  try {
    const body = payloadForSave();
    if (!/^([a-z0-9]+(?:-[a-z0-9]+)*)$/.test(body.slug)) {
      throw new Error("Slug: только строчные латинские буквы, цифры и дефис.");
    }
    if (isNew.value) {
      const saved = await saveCat(body, "create");
      await router.replace(`/edit/${saved.slug}`);
    } else {
      if (body.slug !== slugParam.value) {
        throw new Error("Смена slug из редактора не поддерживается — создайте новую карточку.");
      }
      await saveCat(body, "update");
      await load();
    }
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    saving.value = false;
  }
}

async function onDeleteGallery(url: string) {
  const slug = slugParam.value;
  if (!slug || !canUpload.value) return;
  const ok = window.confirm("Удалить это фото с диска?");
  if (!ok) return;
  error.value = "";
  try {
    if (url.startsWith(`/images/cats/${slug}/`)) {
      await deleteCatImage(slug, url);
    }
    form.gallery = form.gallery.filter((u) => u !== url);
    if (form.gallery.length === 0) {
      form.gallery = [PLACEHOLDER];
    }
    if (form.coverImage === url) {
      form.coverImage = form.gallery[0] ?? PLACEHOLDER;
    }
    await onSave();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}

async function onCropped(blob: Blob) {
  const slug = slugParam.value;
  if (!slug) return;
  error.value = "";
  try {
    const url = await uploadCatImage(slug, blob);
    const withoutPlace = form.gallery.filter((u) => u !== PLACEHOLDER);
    form.gallery = [...withoutPlace, url];
    if (form.coverImage === PLACEHOLDER || !form.gallery.includes(form.coverImage)) {
      form.coverImage = url;
    }
    await onSave();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}
</script>

<template>
  <div class="page">
    <header class="page-head">
      <div>
        <h1>{{ isNew ? "Новый кот" : "Редактирование" }}</h1>
        <p class="sub">
          Тексты для сайта — на <strong>английском</strong> и <strong>французском</strong> (отдельные поля). Подсказки интерфейса на русском.
        </p>
      </div>
      <div class="head-actions">
        <button type="button" class="btn btn-touch secondary" @click="router.push('/')">К списку</button>
        <button type="button" class="btn btn-touch primary" :disabled="saving" @click="onSave">
          {{ saving ? "Сохранение…" : "Сохранить" }}
        </button>
      </div>
    </header>

    <p v-if="error" class="banner error" role="alert">{{ error }}</p>
    <p v-if="loading" class="muted">Загрузка…</p>

    <form v-else class="form" @submit.prevent="onSave">
      <section class="card">
        <h2>Основное</h2>
        <div class="grid2">
          <label class="field">
            <span>Имя на сайте</span>
            <input v-model="form.name" type="text" required autocomplete="off" />
          </label>
          <label class="field">
            <span>Slug (URL)</span>
            <input v-model="form.slug" type="text" required pattern="[a-z0-9]+(-[a-z0-9]+)*" :disabled="!isNew" title="латиница и дефис" />
          </label>
          <label class="field">
            <span>Порядок в списке (меньше — выше)</span>
            <input v-model.number="form.sortOrder" type="number" min="0" step="1" />
          </label>
          <label class="field">
            <span>Статус</span>
            <select v-model="form.status">
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Sold">Sold</option>
              <option value="Not for sale">Not for sale</option>
            </select>
          </label>
          <label class="field check">
            <input v-model="form.featured" type="checkbox" />
            <span>Featured на главной</span>
          </label>
          <label class="field">
            <span>Дата рождения (необязательно, ISO)</span>
            <input v-model="form.birthDate" type="date" />
          </label>
        </div>
        <p class="hint">Возраст в JSON пересчитывается с даты рождения при сохранении. Превью: EN «{{ agePreviewEn }}», FR «{{ agePreviewFr }}»</p>
      </section>

      <section class="card">
        <h2>Английский (EN)</h2>
        <div class="stack">
          <label class="field">
            <span>Коротко о характере</span>
            <textarea v-model="form.personalityShort.en" rows="2" required />
          </label>
          <label class="field">
            <span>Полное описание</span>
            <textarea v-model="form.personality.en" rows="4" required />
          </label>
          <label class="field">
            <span>Здоровье / записи</span>
            <textarea v-model="form.healthNote.en" rows="3" required />
          </label>
          <label class="field">
            <span>Родители / линия</span>
            <textarea v-model="form.parentsNote.en" rows="2" required />
          </label>
          <label class="field">
            <span>Ветеринария (прививки, болезни — уточните позже)</span>
            <textarea v-model="form.vetNotes.en" rows="3" />
          </label>
        </div>
      </section>

      <section class="card">
        <h2>Français (FR)</h2>
        <div class="stack">
          <label class="field">
            <span>Résumé caractère</span>
            <textarea v-model="form.personalityShort.fr" rows="2" required />
          </label>
          <label class="field">
            <span>Description</span>
            <textarea v-model="form.personality.fr" rows="4" required />
          </label>
          <label class="field">
            <span>Santé / dossiers</span>
            <textarea v-model="form.healthNote.fr" rows="3" required />
          </label>
          <label class="field">
            <span>Parents / lignée</span>
            <textarea v-model="form.parentsNote.fr" rows="2" required />
          </label>
          <label class="field">
            <span>Notes vétérinaires</span>
            <textarea v-model="form.vetNotes.fr" rows="3" />
          </label>
        </div>
      </section>

      <section class="card">
        <h2>Фотографии</h2>
        <p v-if="!canUpload" class="hint">
          Сначала сохраните новую карточку — затем можно загружать фото в папку этого slug.
        </p>
        <template v-else>
          <p class="hint">Обрезка 4:3, поворот, экспорт WebP. Файлы: <code>public/images/cats/{{ form.slug }}/</code></p>
          <button type="button" class="btn secondary" @click="cropOpen = true">Добавить фото…</button>
          <ImageCropModal :open="cropOpen" @close="cropOpen = false" @apply="onCropped" />
        </template>
        <label class="field narrow">
          <span>Обложка (URL из галереи)</span>
          <select v-model="form.coverImage">
            <option v-for="u in form.gallery" :key="u" :value="u">{{ u }}</option>
          </select>
        </label>
        <ul class="gallery">
          <li v-for="u in form.gallery" :key="u" class="g-item">
            <img :src="u" alt="" width="120" height="90" />
            <div class="g-meta">
              <code>{{ u }}</code>
              <button
                v-if="canUpload && u !== PLACEHOLDER"
                type="button"
                class="btn sm danger"
                @click="onDeleteGallery(u)"
              >
                Удалить файл
              </button>
            </div>
          </li>
        </ul>
      </section>

      <section class="card tech">
        <button type="button" class="linkish" @click="showTech = !showTech">
          {{ showTech ? "▼" : "▶" }} Технические поля (порода, пол)
        </button>
        <div v-if="showTech" class="grid2 mt">
          <label class="field">
            <span>Пол</span>
            <select v-model="form.gender">
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </label>
          <label class="field">
            <span>Порода EN</span>
            <input v-model="form.breed.en" type="text" />
          </label>
          <label class="field">
            <span>Порода FR</span>
            <input v-model="form.breed.fr" type="text" />
          </label>
          <label class="field">
            <span>Возраст EN (если нет даты рождения)</span>
            <input v-model="form.age.en" type="text" />
          </label>
          <label class="field">
            <span>Возраст FR</span>
            <input v-model="form.age.fr" type="text" />
          </label>
        </div>
      </section>

      <div class="footer-actions">
        <button type="submit" class="btn btn-touch primary" :disabled="saving">{{ saving ? "Сохранение…" : "Сохранить" }}</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page {
  width: 100%;
  margin: 0 auto;
  padding: 1rem max(0.75rem, env(safe-area-inset-left)) 2.5rem max(0.75rem, env(safe-area-inset-right));
  box-sizing: border-box;
}

@media (min-width: 40rem) {
  .page {
    max-width: 50rem;
    padding: 1.25rem clamp(1rem, 3vw, 1.5rem) 2.5rem;
  }
}

.page-head {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

h1 {
  margin: 0 0 0.25rem;
  font-size: 1.45rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.05rem;
}

.sub {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #5c534a;
}

.head-actions,
.footer-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.footer-actions {
  margin-top: 1.5rem;
}

.head-actions .btn-touch,
.footer-actions .btn-touch {
  width: 100%;
}

.banner.error {
  background: #fde8e8;
  color: #8b1c1c;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.muted {
  color: #6b6258;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card {
  background: #fffdf8;
  border: 1px solid #ddd4c8;
  border-radius: 14px;
  padding: 1.25rem 1.35rem;
}

.grid2 {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 40rem) {
  .grid2 {
    grid-template-columns: 1fr 1fr;
  }
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.88rem;
}

.field.narrow {
  max-width: 100%;
  margin-top: 1rem;
}

.field.check {
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.field span {
  font-weight: 600;
  color: #3d3a36;
}

input,
select,
textarea {
  border-radius: 10px;
  border: 1px solid #c9bfb2;
  padding: 0.5rem 0.65rem;
  background: #fff;
}

textarea {
  resize: vertical;
  min-height: 2.5rem;
}

.hint {
  margin: 0.75rem 0 0;
  font-size: 0.8rem;
  color: #6b6258;
}

.gallery {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.g-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: stretch;
}

.g-item img {
  object-fit: cover;
  border-radius: 8px;
  background: #e8e0d6;
}

.g-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.75rem;
  word-break: break-all;
}

.tech .linkish {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: #2f4a32;
  cursor: pointer;
}

.mt {
  margin-top: 1rem;
}

.btn {
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
  box-sizing: border-box;
}

.btn-touch {
  min-height: 2.75rem;
}

.btn.sm {
  padding: 0.3rem 0.55rem;
  font-size: 0.75rem;
  align-self: flex-start;
}

.btn:disabled {
  opacity: 0.5;
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

@media (min-width: 36rem) {
  .page-head {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem 1.5rem;
  }

  .head-actions,
  .footer-actions {
    flex-direction: row;
    flex-wrap: wrap;
    width: auto;
    align-items: center;
  }

  .head-actions .btn-touch,
  .footer-actions .btn-touch {
    width: auto;
    min-height: 2.5rem;
  }

  .g-item {
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .g-meta {
    min-width: min(100%, 12rem);
  }
}
</style>
