import { test, expect } from '@playwright/test'
import { playwright } from 'test-util-ipfs-example'

// Setup
const play = test.extend({
  ...playwright.servers()
})

play.describe('bundle ipfs with esbuild:', () => {
  // DOM
  const nameInput = '#file-name'
  const contentInput = '#file-content'
  const submitBtn = '#add-submit'
  const output = '#output'

  play.beforeEach(async ({ servers, page }) => {
    await page.goto(`http://localhost:${servers[0].port}/`)
  })

  play('should initialize a Helia node and add/get a file', async ({ page }) => {
    const fileName = 'test.txt'
    const fileContent = 'Hello world!'

    await page.fill(nameInput, fileName)
    await page.fill(contentInput, fileContent)
    await page.click(submitBtn)

    await page.waitForSelector(`${output}:has-text("/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi")`)

    const outputContent = await page.textContent(output)

    expect(outputContent).toContain('https://ipfs.io/ipfs/bafkreigaknpexyvxt76zgkitavbwx6ejgfheup5oybpm77f3pxzrvwpfdi')
    expect(outputContent).toContain(fileName)
    expect(outputContent).toContain(fileContent)
  })
})
