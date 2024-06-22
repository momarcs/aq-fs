import axios from 'axios'
import assert from 'assert'

describe('Testing server', () => {
  it('Accessing root url should return 200', async () => {
    const res = await axios.get('http://127.0.0.1:5000')
    assert.equal(200, res.status)
  })
})