import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import glslx from 'glslx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '../../..')

const stubsPath = resolve(__dirname, '../shaders/threejs-stubs.vert.glsl')
const vertexStubs = readFileSync(stubsPath, 'utf-8')

const shaderDirs = [
  'src/three/shaders',
  'src/three/galaxy-detail/shaders',
  'src/three/cosmic-map/shaders',
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
