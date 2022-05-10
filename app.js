const express = require('express')

const app = express()
const port = 3000
// const router = express.Router();

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
])

const got = require('got')
const axios = require('axios')



app.get('/', (req, res) => {

  //res.send(req.query);

  const params=req.query
  try{
    if(params.hasOwnProperty('url') && params.url != null){
      (async () => {
        const targetUrl = params.url//"https://bolceno.com/"
        const options = {
          timeout: 15000,
          retry: { limit: 0, methods: ["GET", "POST"] }
      };
      //const { body: html, url } =
        await got(targetUrl,options).then(async ({body: html, url})=>{
          console.log(html);
          metadata = await metascraper({ html, url })
          console.log(metadata)
          res.json(metadata)
        }).catch((error)=>{
          console.log(error);
          res.json({
            error:true,
            message:"page/domain invalid"
          })
        })

      })()
    }else{
      res.json({
        error:true,
        message:"url is required!"
      })
    }
  }catch(err){
    console.log(err)
    res.json({
      error:true,
      message:"request failed"
    })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
