import { readFileSync, readdirSync } from 'node:fs'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import glslx from 'glslx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = resolve(__dirname, '..')

const stubsPath = resolve(siteRoot, 'src/three/shaders/threejs-stubs.vert.glsl')
const vertexStubs = readFileSync(stubsPath, 'utf-8')

const shaderDirs = [
  'src/three/shaders',
  'src/three/galaxy-detail/shaders',
  'src/three/cosmic-map/shaders',
]

// Expand simple #define NAME value macros (glslx doesn't support preprocessor)
// Conditional directives (#ifndef, #ifdef, #if, #else, #endif) are stripped so
// both branches are compiled together — acceptable for syntax/type checking.
function expandDefines(source) {
  const defines = []
  const lines = source.split('\n')
  const output = []

  for (const line of lines) {
    const trimmed = line.trim()
    // Strip preprocessor conditionals — glslx cannot parse them
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

// Discover all .glsl files
const shaderFiles = []
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

const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const bold = (s) => `\x1b[1m${s}\x1b[0m`

let failures = 0

console.log(bold(`\nLinting ${shaderFiles.length} GLSL shaders...\n`))

for (const filePath of shaderFiles) {
  const label = relative(siteRoot, filePath)
  let source = readFileSync(filePath, 'utf-8')

  if (filePath.endsWith('.vert.glsl')) {
    source = vertexStubs + '\n' + source
  }

  source = expandDefines(source)

  const result = glslx.compile(source, { format: 'json', renaming: 'none' })

  if (result.output !== null) {
    console.log(`  ${green('PASS')}  ${label}`)
  } else {
    failures++
    console.log(`  ${red('FAIL')}  ${label}`)
    console.log(`        ${result.log.trim().split('\n').join('\n        ')}`)
  }
}

console.log()
if (failures > 0) {
  console.log(red(bold(`${failures} shader(s) failed.\n`)))
  process.exit(1)
} else {
  console.log(green(bold(`All ${shaderFiles.length} shaders passed.\n`)))
}
