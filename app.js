const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

const dbName = 'productPrices';

app.get('/', (req, res) => res.send('Hello Product Searcher.'))

app.route('/products/:id')
    .get( function (req, res)
          {
              // call a function here that returns the pricing data from
              // the data store
              price = {"value": 13.49,"currency_code":"USD"};

              // then call a function that gets the name from the
              // external source
              name = "The Big Lebowski (Blu-ray) (Widescreen)";

              // then bundle them together into a json object
              example_object = {"id":req.params.id,"name": name,"current_price": price};

              // and return to the user
              res.json(example_object);
          })
    .put( function (req, res)
          {
              // call a function to break up req and update price in
              // Mongo

              // send updated object back to caller
              res.send("Updated");
          }
        )

app.listen(3000, () => console.log('MyRetail pricing app is running.'))
