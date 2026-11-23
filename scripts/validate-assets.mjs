import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import manifest from '../src/data/portfolio.js'

export const SOURCE_FOLDERS = {
  'ai-edits': 'Ai Edits',
  'car-edits': 'Car Edits',
  'event-edits': 'Event Edits',
  'industrial-production': 'Industrial Production Edits',
  'influencer-edits': 'Influencer Edits',
  'politics-edits': 'Politics Edits',
  'product-edits': 'Product Edits',
  'promotional-edits': 'Promotional Edits',
  'recent-work': 'Visuark - Recent Work',
}

function isLocal(assetPath) {
  return typeof assetPath === 'string' && assetPath.startsWith('assets/') && !assetPath.includes('://')
}

export function collectProblems(data, publicDir, sourceRoot, expected = { categories: 9, videos: 26 }, { checkSources = true } = {}) {
  const problems = []
  const videos = data.videos || []
  const categories = data.categories || []
  const ids = new Set()

  if (categories.length !== expected.categories) problems.push(`expected ${expected.categories} categories, found ${categories.length}`)
  if (videos.length !== expected.videos) problems.push(`expected ${expected.videos} videos, found ${videos.length}`)

  for (const video of videos) {
    if (ids.has(video.id)) problems.push(`duplicate video id: ${video.id}`)
    ids.add(video.id)

    for (const [label, assetPath] of [
      ['full video', video.src],
      ['preview video', video.previewSrc],
      ['poster', video.poster],
    ]) {
      if (!isLocal(assetPath)) {
        problems.push(`remote or invalid ${label} path for ${video.id}: ${assetPath}`)
      } else if (!fs.existsSync(path.join(publicDir, assetPath))) {
        problems.push(`missing ${label} for ${video.id}: ${assetPath}`)
      }
    }

    if (checkSources && (!video.originalPath || video.originalPath.includes('://'))) {
      problems.push(`invalid original path for ${video.id}`)
    } else if (checkSources && !fs.existsSync(path.join(sourceRoot, video.originalPath))) {
      problems.push(`missing original for ${video.id}: ${video.originalPath}`)
    }
  }

  for (const category of categories) {
    const folder = SOURCE_FOLDERS[category.id]
    if (!folder) {
      problems.push(`unknown category id: ${category.id}`)
      continue
    }
    const listed = videos.filter((video) => video.category === category.id).length
    const directory = path.join(sourceRoot, folder)
    const actual = checkSources && fs.existsSync(directory)
      ? fs.readdirSync(directory).filter((name) => /\.(mp4|mov)$/i.test(name)).length
      : listed
    if (category.count !== actual) {
      problems.push(`count mismatch for ${category.id}: manifest ${category.count}, found ${actual}`)
    }
    if (checkSources && listed !== actual) {
      problems.push(`manifest category ${category.id} lists ${listed} videos, source has ${actual}`)
    }
  }

  for (const [name, value] of [
    ['hero', data.hero?.videoId],
    ['showreel', data.showreel?.videoId],
    ...(data.featuredIds || []).map((id, index) => [`featured ${index + 1}`, id]),
  ]) {
    if (!ids.has(value)) problems.push(`${name} references unknown video id: ${value}`)
  }

  if (!isLocal(data.site?.logo) || !fs.existsSync(path.join(publicDir, data.site.logo))) {
    problems.push(`missing logo: ${data.site?.logo}`)
  }

  return problems
}

function main() {
  const directory = path.dirname(fileURLToPath(import.meta.url))
  const root = path.resolve(directory, '..')
  const hasSources = Object.values(SOURCE_FOLDERS).some((folder) => fs.existsSync(path.join(root, folder)))
  const problems = collectProblems(manifest, path.join(root, 'public'), root, undefined, { checkSources: hasSources })

  if (problems.length) {
    console.error(`VALIDATION FAILED (${problems.length} problems)`)
    for (const problem of problems) console.error(`  - ${problem}`)
    process.exit(1)
  }

  const sourceNote = hasSources ? 'all derivative and original paths present.' : 'all derivative paths present; original sources not present (skipped).'
  console.log(`VALIDATION PASSED: ${manifest.categories.length} categories, ${manifest.videos.length} videos, ${sourceNote}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main()
}
