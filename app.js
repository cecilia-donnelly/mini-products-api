const express = require('express')
const app = express()
var config = require('./config');
var redsky = require('./redsky');
var rp = require('request-promise');
var MongoClient = require('mongodb').MongoClient;

app.get('/', (req, res) => res.send('Hello Product Searcher.'))

app.route('/products/:id')
    .get( function (req, res)
          {
              // Connect to the local data store and search for pricing
              // data by ID
              MongoClient.connect(config.db_url, function(err, client) {
                  if (err) {
                      console.log("DEBUG: error connecting to Mongo");
                      console.log(err);
                  }
                  else {
                      const db = client.db('productPrices');

                      var product_id = parseInt(req.params.id);
                      db.collection('productPrices').find(
                          { "product_id": product_id }
                      ).toArray(function (err, result) {
                          if (err) throw err;

                          var price_obj = {}
                          if (result[0]) {
                              price_obj = result[0]['current_price'];
                          }
                          
                          // external source
                          redsky.search(product_id, config.redsky_host, config.redsky_path, price_obj)
                              .then( function (name) {
                                  console.log("DEBUG: do I still have price?");
                                  console.log(price_obj);
                                  console.log("DEBUG: did my promise return what I wanted?");
                                  console.log(name);
                                  // then bundle them together into a json object
                                  product_object = {
                                      "id":req.params.id,
                                      "name": name,
                                      "current_price": price_obj
                                  };

                                  // and return to the user
                                  res.json(product_object);
                              });
                      });
                  }
              });

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
