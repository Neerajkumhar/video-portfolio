import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { collectProblems } from './validate-assets.mjs'

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'visuark-validate-'))
  const publicDir = path.join(root, 'public')
  const sourceRoot = path.join(root, 'source')
  const assets = path.join(publicDir, 'assets', 'videos', 'ai-edits')
  const source = path.join(sourceRoot, 'Ai Edits')
  fs.mkdirSync(assets, { recursive: true })
  fs.mkdirSync(source, { recursive: true })
  for (const name of ['full.mp4', 'preview.mp4', 'poster.jpg']) {
    fs.writeFileSync(path.join(assets, `one-${name}`), '')
  }
  fs.mkdirSync(path.join(publicDir, 'assets', 'logo'), { recursive: true })
  fs.writeFileSync(path.join(publicDir, 'assets', 'logo', 'logo.png'), '')
  fs.writeFileSync(path.join(source, 'clip.mov'), '')
  const manifest = {
    site: { logo: 'assets/logo/logo.png' },
    categories: [{ id: 'ai-edits', name: 'AI Edits', count: 1 }],
    videos: [{
      id: 'ai-edits-01',
      category: 'ai-edits',
      src: 'assets/videos/ai-edits/one-full.mp4',
      previewSrc: 'assets/videos/ai-edits/one-preview.mp4',
      poster: 'assets/videos/ai-edits/one-poster.jpg',
      originalPath: 'Ai Edits/clip.mov',
    }],
    hero: { videoId: 'ai-edits-01' },
    showreel: { videoId: 'ai-edits-01' },
    featuredIds: ['ai-edits-01'],
  }
  return { root, publicDir, sourceRoot, manifest }
}

test('accepts a manifest whose files all exist', () => {
  const { publicDir, sourceRoot, manifest } = fixture()
  assert.deepEqual(collectProblems(manifest, publicDir, sourceRoot, { categories: 1, videos: 1 }), [])
})

test('reports a missing derived video file', () => {
  const { publicDir, sourceRoot, manifest } = fixture()
  fs.unlinkSync(path.join(publicDir, manifest.videos[0].src))
  const problems = collectProblems(manifest, publicDir, sourceRoot, { categories: 1, videos: 1 })
  assert.ok(problems.some((problem) => problem.includes('missing')))
})

test('reports duplicate video ids', () => {
  const { publicDir, sourceRoot, manifest } = fixture()
  manifest.videos.push({ ...manifest.videos[0] })
  const problems = collectProblems(manifest, publicDir, sourceRoot, { categories: 1, videos: 1 })
  assert.ok(problems.some((problem) => problem.includes('duplicate')))
})

test('rejects remote asset paths', () => {
  const { publicDir, sourceRoot, manifest } = fixture()
  manifest.videos[0].src = 'https://example.com/video.mp4'
  const problems = collectProblems(manifest, publicDir, sourceRoot, { categories: 1, videos: 1 })
  assert.ok(problems.some((problem) => problem.includes('remote')))
})

test('reports a category count that disagrees with source files', () => {
  const { publicDir, sourceRoot, manifest } = fixture()
  manifest.categories[0].count = 2
  const problems = collectProblems(manifest, publicDir, sourceRoot, { categories: 1, videos: 1 })
  assert.ok(problems.some((problem) => problem.includes('count')))
})
