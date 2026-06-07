/**
 * FinTraxx frontend driver
 *
 * Usage:
 *   node driver.mjs [command] [args…]
 *
 * Commands:
 *   screenshot [path]        Full-page screenshot (default: /tmp/fintraxx.png)
 *   navigate <path>          Navigate to <path> and screenshot
 *   click <selector>         Click an element
 *   fill <selector> <value>  Fill an input
 *   eval <expression>        Evaluate JS in page and print result
 *   smoke                    Run a quick smoke check of key routes
 *
 * The BASE_URL env var overrides the default http://localhost:5175
 */

import { chromium } from 'playwright'

const BASE_URL = process.env.BASE_URL || 'http://localhost:5175'
const [,, cmd = 'screenshot', ...args] = process.argv

async function withPage(fn) {
  const browser = await chromium.launch({ headless: true })
  const ctx     = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page    = await ctx.newPage()
  // suppress console noise
  page.on('console', () => {})
  page.on('pageerror', () => {})
  try {
    await fn(page)
  } finally {
    await browser.close()
  }
}

async function ss(page, dest = '/tmp/fintraxx.png') {
  await page.screenshot({ path: dest, fullPage: false })
  console.log('screenshot:', dest)
}

const cmds = {
  async screenshot([dest = '/tmp/fintraxx.png']) {
    await withPage(async page => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await ss(page, dest)
    })
  },

  async navigate([route = '/', dest]) {
    const outPath = dest || `/tmp/fintraxx-${route.replace(/\//g, '_') || 'home'}.png`
    await withPage(async page => {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' })
      await ss(page, outPath)
    })
  },

  async click([selector]) {
    await withPage(async page => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.click(selector)
      await page.waitForTimeout(500)
      await ss(page)
    })
  },

  async fill([selector, value]) {
    await withPage(async page => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.fill(selector, value)
      await ss(page)
    })
  },

  async eval([expression]) {
    await withPage(async page => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      const result = await page.evaluate(expression)
      console.log(JSON.stringify(result, null, 2))
    })
  },

  async smoke() {
    const routes  = ['/', '/calculator', '/budgets', '/analytics', '/settings']
    const results = []

    for (const route of routes) {
      await withPage(async page => {
        try {
          const res = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle', timeout: 10_000 })
          const status = res?.status() ?? 0
          const dest   = `/tmp/fintraxx-smoke${route.replace(/\//g, '-') || '-home'}.png`
          await ss(page, dest)
          results.push({ route, status, ok: status >= 200 && status < 400 })
        } catch (err) {
          results.push({ route, status: 0, ok: false, error: err.message })
        }
      })
    }

    const allOk = results.every(r => r.ok)
    console.log(JSON.stringify(results, null, 2))
    process.exit(allOk ? 0 : 1)
  },
}

const fn = cmds[cmd]
if (!fn) {
  console.error(`Unknown command: ${cmd}. Available: ${Object.keys(cmds).join(', ')}`)
  process.exit(1)
}

fn(args).catch(err => { console.error(err.message); process.exit(1) })
