<script setup lang="ts">
import { computed, reactive } from "vue";
import type { CatOption } from "../../data/cats";

export interface ContactFormUi {
  intro: string;
  name: string;
  email: string;
  phone: string;
  cat: string;
  notSure: string;
  message: string;
  submit: string;
  errName: string;
  errEmail: string;
  errMessage: string;
  errMailto: string;
  mailSubjectPrefix: string;
  mailBodyLabelName: string;
  mailBodyLabelReplyEmail: string;
  mailBodyLabelPhone: string;
  mailBodyLabelCat: string;
  mailBodyLabelMessage: string;
  mailHint: string;
}

const props = withDefaults(
  defineProps<{
    /** Inbox for mailto: — use your own address (e.g. PUBLIC_CONTACT_EMAIL); no third-party APIs */
    mailtoEmail: string;
    catOptions: CatOption[];
    initialCatSlug?: string;
    ui: ContactFormUi;
  }>(),
  {
    initialCatSlug: "",
  },
);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  message: "",
  catSlug: props.initialCatSlug ?? "",
});

const errors = reactive({
  name: "",
  email: "",
  message: "",
  config: "",
});

const catSelectOptions = computed(() => props.catOptions);

function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function catLabelForBody(): string {
  if (!form.catSlug.trim()) return props.ui.notSure;
  const hit = props.catOptions.find((c) => c.slug === form.catSlug);
  return hit ? `${hit.name} (${hit.slug})` : form.catSlug;
}

function onSubmit(e: Event) {
  e.preventDefault();
  errors.name = "";
  errors.email = "";
  errors.message = "";
  errors.config = "";

  const to = props.mailtoEmail.trim();
  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    errors.config = props.ui.errMailto;
    return;
  }

  let ok = true;
  if (!form.name.trim()) {
    errors.name = props.ui.errName;
    ok = false;
  }
  if (!form.email.trim() || !validateEmail(form.email)) {
    errors.email = props.ui.errEmail;
    ok = false;
  }
  if (!form.message.trim()) {
    errors.message = props.ui.errMessage;
    ok = false;
  }

  if (!ok) return;

  const subject = encodeURIComponent(`${props.ui.mailSubjectPrefix} ${form.name.trim()}`);
  let body = `${props.ui.mailBodyLabelName}: ${form.name.trim()}\n`;
  body += `${props.ui.mailBodyLabelReplyEmail}: ${form.email.trim()}\n`;
  if (form.phone.trim()) {
    body += `${props.ui.mailBodyLabelPhone}: ${form.phone.trim()}\n`;
  }
  body += `${props.ui.mailBodyLabelCat}: ${catLabelForBody()}\n\n`;
  body += `${props.ui.mailBodyLabelMessage}:\n${form.message.trim()}`;

  window.location.href = `mailto:${to}?subject=${subject}&body=${encodeURIComponent(body)}`;
}
</script>

<template>
  <form class="rounded-3xl border border-beige-300/70 bg-white p-6 sm:p-8 shadow-sm" novalidate @submit="onSubmit">
    <p class="text-sm text-warm-600">{{ ui.intro }}</p>
    <p class="mt-2 text-xs text-warm-500">{{ ui.mailHint }}</p>
    <p v-if="errors.config" class="mt-2 text-sm text-red-700" role="alert">{{ errors.config }}</p>

    <div class="mt-6 grid gap-5 sm:grid-cols-2">
      <div class="sm:col-span-2">
        <label for="cf-name" class="block text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.name }}</label>
        <input
          id="cf-name"
          v-model="form.name"
          type="text"
          autocomplete="name"
          class="mt-1.5 w-full rounded-2xl border border-beige-300 bg-cream-50 px-4 py-3 text-sm text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
          :aria-invalid="errors.name ? 'true' : 'false'"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-700">{{ errors.name }}</p>
      </div>
      <div>
        <label for="cf-email" class="block text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.email }}</label>
        <input
          id="cf-email"
          v-model="form.email"
          type="email"
          autocomplete="email"
          class="mt-1.5 w-full rounded-2xl border border-beige-300 bg-cream-50 px-4 py-3 text-sm text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
          :aria-invalid="errors.email ? 'true' : 'false'"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-700">{{ errors.email }}</p>
      </div>
      <div>
        <label for="cf-phone" class="block text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.phone }}</label>
        <input
          id="cf-phone"
          v-model="form.phone"
          type="tel"
          autocomplete="tel"
          class="mt-1.5 w-full rounded-2xl border border-beige-300 bg-cream-50 px-4 py-3 text-sm text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
        />
      </div>
      <div class="sm:col-span-2">
        <label for="cf-cat" class="block text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.cat }}</label>
        <select
          id="cf-cat"
          v-model="form.catSlug"
          class="mt-1.5 w-full rounded-2xl border border-beige-300 bg-cream-50 px-4 py-3 text-sm text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
        >
          <option value="">{{ ui.notSure }}</option>
          <option v-for="c in catSelectOptions" :key="c.slug" :value="c.slug">{{ c.name }}</option>
        </select>
      </div>
      <div class="sm:col-span-2">
        <label for="cf-msg" class="block text-xs font-semibold uppercase tracking-wide text-warm-500">{{ ui.message }}</label>
        <textarea
          id="cf-msg"
          v-model="form.message"
          rows="5"
          class="mt-1.5 w-full rounded-2xl border border-beige-300 bg-cream-50 px-4 py-3 text-sm text-soft-900 focus:border-soft-700 focus:outline-none focus:ring-2 focus:ring-soft-700/30"
          :aria-invalid="errors.message ? 'true' : 'false'"
        />
        <p v-if="errors.message" class="mt-1 text-sm text-red-700">{{ errors.message }}</p>
      </div>
    </div>

    <div class="mt-6">
      <button
        type="submit"
        class="inline-flex justify-center rounded-2xl bg-soft-800 px-6 py-3.5 text-sm font-semibold text-cream-50 hover:bg-soft-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-soft-700 focus-visible:ring-offset-2"
      >
        {{ ui.submit }}
      </button>
    </div>
  </form>
</template>
