import axios from 'axios'
import NodeCache from "node-cache";
const cacheInstance = new NodeCache();
const FOOTPRINT_CACHE_KEY = "__footprints"

export default {
  get(apiUrl) {
    return axios.get(apiUrl, {
      auth: {
        username: 'any-user-name',
        password: process.env.API_KEY
      }
    })
  },

  // fetch all countries
  async getCountries() {
    const resp = await this.get('https://api.footprintnetwork.org/v1/countries')
    return resp.data
  },

  // fetch a single country by countryCode
  async getDataForCountry(countryCode) {
    const resp = await this.get(`https://api.footprintnetwork.org/v1/data/${countryCode}/all/EFCpc`)
    return resp.data
  },

  // fetch all countries and data
  async getCountriesWithData() {

    const resp = await this.get(`https://api.footprintnetwork.org/v1/data/all/all/EFCpc`)
    const data = resp.data

    if (cacheInstance.has(FOOTPRINT_CACHE_KEY)) {
      console.log(":: Cache Hit ::")
      return cacheInstance.get(FOOTPRINT_CACHE_KEY)
    }

    console.log(":: Cache Miss ::")

    let footprints = {};
    footprints.worldTotalCarbon = 0

    for (const item of data) {
      const { year, countryName, carbon } = item
      if (!footprints[year]) {
        footprints[year] = {
          totalCarbon: 0,
          entries: []
        };
      }

      if (carbon) {

        footprints.worldTotalCarbon += carbon;
        footprints[year].totalCarbon += carbon;
        footprints[year].entries.push({
          countryName,
          carbon
        })
        footprints[year].entries.sort((a, b) => b.carbon - a.carbon);
      }
    }

    cacheInstance.set(FOOTPRINT_CACHE_KEY, footprints, 1 * 60 * 60);
    return footprints
  }
}
