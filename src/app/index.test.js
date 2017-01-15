import path from 'path'
import helpers from 'yeoman-test'
import assert from 'yeoman-assert'

const run = () => helpers.run(path.join(__dirname))

describe('app', () => {
  it('copies files properly', async () => {
    await run().withPrompts({ url: path.join(__dirname, '../../fixture') })
    assert.file(['index.js'])
  })
})
