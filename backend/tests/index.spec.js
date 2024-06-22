import axios from 'axios';
import assert from 'assert';
import footprintApi from '../footprintApi';

describe('Testing server', () => {

  it('Accessing root URL should return 200', async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000');
      assert.equal(200, res.status);
    } catch (error) {
      assert.fail("Error", error);
    }
  })

  it('/footprints API should return 200 and data key', async () => {
    try {
      const res = await axios.get('http://127.0.0.1:5000/footprints');
      assert.equal(200, res.status);
      assert.ok(res.data, 'API response must have a "data" key');

    } catch (error) {
      assert.fail("Error", error);
    }
  })

  it('/getCountriesWithData() with cached and no caching check', async () => {
    try {
      // NOT CACHED CASE
      const t0 = process.hrtime();
      let data = await footprintApi.getCountriesWithData();
      const t1 = process.hrtime(t0);
      const fetchTime = t1[0] * 1e3 + t1[1] / 1e6;
      assert.ok(data, 'getCountriesWithData should return data on cache miss');
      assert.notStrictEqual(data, {}, 'Returned data should not be an empty object on cache miss');

      // CACHED CASE
      const t2 = process.hrtime();
      const dataCached = await footprintApi.getCountriesWithData();
      const t3 = process.hrtime(t2);
      const cacheTime = t3[0] * 1e3 + t3[1] / 1e6;

      assert.ok(dataCached, 'getCountriesWithData should return cached data');
      assert.deepStrictEqual(data, dataCached, 'Returned data should be the same as cached data');
      console.log('Fetch Time (ms):', fetchTime);
      console.log('Cache Time (ms):', cacheTime);
      console.log('Cache is ~', Math.floor((cacheTime / fetchTime) * 100), '% faster');
    } catch (error) {
      assert.fail("Error", error);
    }
  })

  it('/getCountriesWithData() should return data', async () => {
    try {
      const data = await footprintApi.getCountriesWithData();
      assert.ok(data, 'getCountriesWithData should return data');
      assert.notStrictEqual(data, {}, 'Returned data should not be an empty object');

    } catch (error) {
      assert.fail("Error", error);
    }
  })


});