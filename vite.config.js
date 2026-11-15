import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

const PLAYER_DO_YOUTUBE = 'https://www.youtube-nocookie.com'

function origemDe(endereco) {
  try {
    return new URL(endereco).origin
  } catch {
    return ''
  }
}

function politicaDeSeguranca(origemDaApi, emDesenvolvimento) {
  const conexoes = ["'self'", origemDaApi, emDesenvolvimento ? 'ws: wss:' : '']
    .filter(Boolean)
    .join(' ')

  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    `connect-src ${conexoes}`,
    `frame-src ${PLAYER_DO_YOUTUBE}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
}

function cabecalhoDeSeguranca(politica) {
  return {
    name: 'forcamente-csp',
    transformIndexHtml() {
      return {
        tags: [
          {
            tag: 'meta',
            attrs: { 'http-equiv': 'Content-Security-Policy', content: politica },
            injectTo: 'head-prepend',
          },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const ambiente = loadEnv(mode, import.meta.dirname, '')
  const politica = politicaDeSeguranca(
    origemDe(ambiente.VITE_API_URL),
    command === 'serve',
  )

  return {
    plugins: [
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
      cabecalhoDeSeguranca(politica),
    ],
    server: {
      headers: {
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-Content-Type-Options': 'nosniff',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      },
    },
  }
})
