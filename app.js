const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello Product Searcher.'))

app.route('/products/:id')
    .get( function (req, res)
          {
              // call a function here that returns the object from the
              // data store in json
              res.json({"id":req.params.id,"name":"The Big Lebowski (Blu-ray) (Widescreen)","current_price":{"value": 13.49,"currency_code":"USD"}});
          })
    .put( function (req, res)
          {
              res.send("Updated");
          }
        )

app.listen(3000, () => console.log('MyRetail pricing app is running.'))
