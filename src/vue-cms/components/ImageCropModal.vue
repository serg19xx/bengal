<script setup lang="ts">
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits<{
  close: [];
  apply: [blob: Blob];
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const imgRef = ref<HTMLImageElement | null>(null);
let cropper: InstanceType<typeof Cropper> | null = null;
/** Must be a ref so the template updates when Cropper is ready (`cropper` itself is not reactive). */
const cropperReady = ref(false);
const objectUrl = ref<string | null>(null);

function destroyCropper() {
  cropper?.destroy();
  cropper = null;
  cropperReady.value = false;
}

function revokeUrl() {
  if (objectUrl.value) {
    URL.revokeObjectURL(objectUrl.value);
    objectUrl.value = null;
  }
}

function reset() {
  destroyCropper();
  revokeUrl();
  if (fileInput.value) fileInput.value.value = "";
}

watch(
  () => props.open,
  (v) => {
    if (!v) reset();
  },
);

onBeforeUnmount(() => {
  reset();
});

function triggerPick() {
  fileInput.value?.click();
}

async function onPickFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  revokeUrl();
  objectUrl.value = URL.createObjectURL(file);
  await nextTick();
  if (!imgRef.value) return;
  imgRef.value.src = objectUrl.value;
  destroyCropper();
  cropper = new Cropper(imgRef.value, {
    aspectRatio: 4 / 3,
    viewMode: 1,
    autoCropArea: 1,
    responsive: true,
    ready() {
      cropperReady.value = true;
    },
  });
}

function rotate() {
  cropper?.rotate(90);
}

function onCancel() {
  reset();
  emit("close");
}

function onApply() {
  if (!cropper) return;
  const canvas = cropper.getCroppedCanvas({
    width: 1200,
    height: 900,
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "high",
  });
  canvas.toBlob(
    (blob) => {
      if (!blob) return;
      reset();
      emit("apply", blob);
      emit("close");
    },
    "image/webp",
    0.9,
  );
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="modal-root"
      role="dialog"
      aria-modal="true"
      aria-label="Обрезка фото"
    >
      <div class="modal-backdrop" @click="onCancel" />
      <div class="modal-panel">
        <h2 class="modal-title">Фото: обрезка и поворот</h2>
        <p class="modal-hint">
          Соотношение 4:3. Можно повернуть кадр. Тексты сайта заполняйте на английском и французском — русский здесь только в интерфейсе админки.
        </p>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="sr-only"
          tabindex="-1"
          @change="onPickFile"
        />
        <div v-if="!objectUrl" class="pick-row">
          <button type="button" class="btn primary" @click="triggerPick">Выбрать файл…</button>
          <button type="button" class="btn secondary" @click="onCancel">Отмена</button>
        </div>
        <template v-else>
          <div class="crop-wrap">
            <img ref="imgRef" class="crop-img" alt="" crossorigin="anonymous" />
          </div>
          <div class="modal-actions">
            <button type="button" class="btn secondary" @click="rotate">Поворот 90°</button>
            <button type="button" class="btn secondary" @click="onCancel">Отмена</button>
            <button type="button" class="btn primary" :disabled="!cropperReady" @click="onApply">Добавить</button>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

.pick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.modal-root {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(20, 18, 16, 0.55);
}

.modal-panel {
  position: relative;
  z-index: 1;
  width: min(960px, 100%);
  max-height: 90vh;
  overflow: auto;
  background: #fffdf8;
  border-radius: 16px;
  padding: 1.25rem 1.5rem 1.5rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 0.35rem;
  font-size: 1.15rem;
}

.modal-hint {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  color: #5c534a;
}

.crop-wrap {
  max-height: 55vh;
  background: #e8e0d6;
  border-radius: 12px;
  overflow: hidden;
}

.crop-img {
  display: block;
  max-width: 100%;
  max-height: 55vh;
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: flex-end;
}

.btn {
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid transparent;
  cursor: pointer;
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
</style>
