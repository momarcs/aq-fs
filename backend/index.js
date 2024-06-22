import express from 'express'
import bodyParser from 'body-parser'
import cors from "cors"
import footprintApi from './footprintApi'

const app = express()
app.use(bodyParser.json())
app.use(cors("*"))

app.get('/footprints', async (req, res) => {
  const data = await footprintApi.getCountriesWithData()
  return res.status(200).json({ data })
})

app.get('/', async (req, res) => {
  const countries = await footprintApi.getCountries()
  const country = await footprintApi.getDataForCountry(229)

  res.send(`
    <center>
      <h1>Welcome to Altruistiq!</h1>
      <div style="display: flex; flex-direction: row;">
        <div style="width: 50%; margin-right: 20px;">    
          <h3>Example countries JSON (first 5 results)</h3> 
          <pre style="  
            text-align: left;
            background: #f8f8f8;
            border: 1px solid #efefef;
            border-radius: 6px;
            padding: 2em;"
          >${JSON.stringify(countries?.slice(0, 5), null, 2)}</pre>
        </div>
        <div style="width: 50%;">    
          <h3>Example country JSON (first 5 years)</h3>
          <pre style="  
            text-align: left;
            background: #f8f8f8;
            border: 1px solid #efefef;
            border-radius: 6px;
            padding: 2em;"
          >${JSON.stringify(country, null, 2)}</pre>         
        </div>
      </div>
    </center>    
  `)

  console.log('showing first 5 countries:')
  console.log(countries.slice(0, 5))
  console.log('showing first 5 years of a country:')
  console.log(country.slice(0, 5))
})

app.listen(5000, () => {
  console.log('app is listening on port 5000')
})