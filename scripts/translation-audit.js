const fs = require('fs')
const path = require('path')

const enPath = path.join(__dirname, '../lib/en.json')
const hiPath = path.join(__dirname, '../lib/hi.json')

function loadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (err) {
    console.error(`Failed to load: ${p}`, err)
    process.exit(1)
  }
}

const en = loadJSON(enPath)
const hi = loadJSON(hiPath)

function getKeysFlat(obj, prefix = '') {
  let keys = {}
  for (const k in obj) {
    const keyPath = prefix ? `${prefix}.${k}` : k
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(keys, getKeysFlat(obj[k], keyPath))
    } else {
      keys[keyPath] = true
    }
  }
  return keys
}

const enFlat = getKeysFlat(en)
const hiFlat = getKeysFlat(hi)

const enKeys = Object.keys(enFlat)
const hiKeys = Object.keys(hiFlat)

console.log('--- Translation Completeness Audit ---')
console.log(`en.json keys count: ${enKeys.length}`)
console.log(`hi.json keys count: ${hiKeys.length}`)

const missingInHi = enKeys.filter(k => !hiFlat[k])
const missingInEn = hiKeys.filter(k => !enFlat[k])

console.log(`\nMissing in hi.json (present in en.json): ${missingInHi.length}`)
missingInHi.forEach(k => console.log(`  - ${k}`))

console.log(`\nMissing in en.json (present in hi.json): ${missingInEn.length}`)
missingInEn.forEach(k => console.log(`  - ${k}`))
