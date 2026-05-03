/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly CMS_ADMIN_PASSWORD?: string;
  readonly CMS_SESSION_SECRET?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
