import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import glslx from 'glslx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '../../..')

const stubsPath = resolve(__dirname, '../shaders/threejs-stubs.vert.glsl')
const vertexStubs = readFileSync(stubsPath, 'utf-8')

/** Fragment shader library deps — prepend these before compiling */
const shaderDeps: Record<string, string[]> = {
  'particle.vert.glsl': ['dust-transmission.glsl'],
  'galaxy-render.glsl': ['noise-value.glsl'],
  'galaxy.frag.glsl': ['noise-value.glsl', 'galaxy-render.glsl'],
}

const planetFragShaders = [
  'rocky.frag.glsl', 'gasGiant.frag.glsl', 'hotJupiter.frag.glsl',
  'iceGiant.frag.glsl', 'icyWorld.frag.glsl', 'lavaWorld.frag.glsl',
  'oceanWorld.frag.glsl', 'subNeptune.frag.glsl', 'desertWorld.frag.glsl',
  'tidallyLocked.frag.glsl',
]
for (const name of planetFragShaders) {
  shaderDeps[name] = ['../noise.glsl', '../color.glsl', '../lighting.glsl', '../seed.glsl']
}

// Star shaders — library prepend order mirrors StarScene.ts shader assembly.
// seed.glsl is itself a library (no main()); it depends on noise/color helpers.
shaderDeps['seed.glsl'] = ['noise.glsl', 'color.glsl']
shaderDeps['surface.vert.glsl'] = ['noise.glsl', 'color.glsl', 'seed.glsl']
shaderDeps['surface.frag.glsl'] = ['noise.glsl', 'color.glsl', 'lighting.glsl', 'seed.glsl']
shaderDeps['corona.frag.glsl'] = ['noise.glsl', 'color.glsl', 'seed.glsl']
shaderDeps['flameTongues.frag.glsl'] = ['noise.glsl', 'color.glsl', 'seed.glsl']
shaderDeps['flare.frag.glsl'] = ['noise.glsl', 'color.glsl', 'seed.glsl']
shaderDeps['rays.frag.glsl'] = ['color.glsl', 'seed.glsl']

const shaderDirs = [
  'src/three/shaders',
  'src/three/galaxy-detail/shaders',
  'src/three/cosmic-map/shaders',
  'src/three/nsa/shaders',
  'src/three/star/shaders',
  'src/three/star/shaders/planet',
]

// Discover all .glsl files across shader directories
const shaderFiles: string[] = []
for (const dir of shaderDirs) {
  const fullDir = resolve(siteRoot, dir)
  try {
    const entries = readdirSync(fullDir)
    for (const entry of entries) {
      if (entry.endsWith('.glsl') && !entry.includes('stubs')) {
        shaderFiles.push(resolve(fullDir, entry))
      }
    }
  } catch {
    // Directory might not exist
  }
}

// Expand simple #define NAME value macros (glslx doesn't support preprocessor)
function expandDefines(source: string): string {
  const defines: Array<[RegExp, string]> = []
  const lines = source.split('\n')
  const output: string[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    // Strip preprocessor directives (#ifndef, #ifdef, #if, #else, #endif)
    if (/^\s*#(ifndef|ifdef|if|else|endif)\b/.test(trimmed)) {
      continue
    }
    const match = line.match(/^\s*#define\s+(\w+)\s+(.+)$/)
    if (match) {
      defines.push([new RegExp(`\\b${match[1]}\\b`, 'g'), match[2].trim()])
    } else {
      output.push(line)
    }
  }

  let result = output.join('\n')
  for (const [pattern, value] of defines) {
    result = result.replace(pattern, value)
  }
  return result
}

describe('GLSL shader compilation', () => {
  it.each(shaderFiles.map((f) => [relative(siteRoot, f), f]))(
    '%s compiles without errors',
    (_label, filePath) => {
      let source = readFileSync(filePath, 'utf-8')

      // Prepend vertex stubs for vertex shaders
      if (filePath.endsWith('.vert.glsl')) {
        source = vertexStubs + '\n' + source
      }

      // Prepend library dependencies for shaders that need them
      const fileName = filePath.replace(/\\/g, '/').split('/').pop()!
      const deps = shaderDeps[fileName]
      if (deps) {
        const dir = dirname(filePath)
        const depSources = deps.map((dep) => readFileSync(resolve(dir, dep), 'utf-8'))
        source = depSources.join('\n') + '\n' + source
      }

      // Expand #define macros for glslx compatibility
      source = expandDefines(source)

      const result = glslx.compile(source, { format: 'json', renaming: 'none' })

      if (result.output === null) {
        throw new Error(`Shader compilation failed:\n${result.log}`)
      }

      expect(result.output).not.toBeNull()
    },
  )
})
