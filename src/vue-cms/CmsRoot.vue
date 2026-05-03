<script setup lang="ts">
import { getCurrentInstance, onBeforeMount, onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import { getSession, login } from './api';
import { cmsRouter } from './router';
import './style.css';

const gate = ref<'loading' | 'login' | 'app'>('loading');
const requireLogin = ref(true);
const password = ref('');
const loginError = ref('');

onBeforeMount(() => {
  const app = getCurrentInstance()?.appContext.app;
  const marked = app as unknown as { __cmsRouter?: boolean } | undefined;
  if (app && !marked?.__cmsRouter) {
    app.use(cmsRouter);
    (app as unknown as { __cmsRouter?: boolean }).__cmsRouter = true;
  }
});

onMounted(async () => {
  try {
    const j = await getSession();
    requireLogin.value = j.requireLogin;
    if (!j.requireLogin || j.authenticated) gate.value = 'app';
    else gate.value = 'login';
  } catch {
    gate.value = 'login';
  }
});

async function onSubmitLogin() {
  loginError.value = '';
  try {
    await login(password.value);
    gate.value = 'app';
  } catch (e) {
    loginError.value = e instanceof Error ? e.message : String(e);
  }
}
</script>

<template>
  <div class="cms-shell">
    <div v-if="gate === 'loading'" class="center muted">Загрузка…</div>
    <form v-else-if="gate === 'login'" class="login-card" @submit.prevent="onSubmitLogin">
      <h1>CMS Willow Home</h1>
      <p class="hint">Вход для владельца. Ссылка на эту страницу не показывается в меню сайта.</p>
      <label class="field">
        <span>Пароль</span>
        <input v-model="password" type="password" autocomplete="current-password" required />
      </label>
      <p v-if="loginError" class="err" role="alert">{{ loginError }}</p>
      <button type="submit" class="btn primary">Войти</button>
      <p v-if="requireLogin" class="fineprint">
        Пароль задаётся на сервере переменной окружения <code>CMS_ADMIN_PASSWORD</code>.
      </p>
    </form>
    <RouterView v-else />
  </div>
</template>

<style scoped>
.cms-shell {
  min-height: 100vh;
}

.center {
  padding: 2rem;
  text-align: center;
}

.muted {
  color: #6b6258;
}

.login-card {
  max-width: 380px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fffdf8;
  border: 1px solid #ddd4c8;
  border-radius: 16px;
}

h1 {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
}

.hint {
  margin: 0 0 1.25rem;
  font-size: 0.88rem;
  color: #5c534a;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.field span {
  font-weight: 600;
  font-size: 0.85rem;
}

.field input {
  border-radius: 10px;
  border: 1px solid #c9bfb2;
  padding: 0.55rem 0.65rem;
}

.err {
  color: #8b1c1c;
  font-size: 0.88rem;
  margin: 0 0 0.75rem;
}

.btn.primary {
  width: 100%;
  border-radius: 10px;
  padding: 0.6rem;
  font-weight: 600;
  background: #2f3d31;
  color: #faf6ef;
  border: none;
  cursor: pointer;
}

.fineprint {
  margin: 1rem 0 0;
  font-size: 0.72rem;
  color: #8a8075;
}

code {
  font-size: 0.85em;
}
</style>
