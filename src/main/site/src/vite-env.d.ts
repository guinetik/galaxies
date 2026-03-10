/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.glsl?raw' {
  const value: string
  export default value
}

/** Aladin Lite has no TypeScript definitions */
declare module 'aladin-lite' {
  const A: { aladin: (selector: string, options?: Record<string, unknown>) => unknown }
  export default A
}
