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
              var price_obj = {}
              var product_id = parseInt(req.params.id);
              // Connect to the local data store and search for pricing
              // data by ID
              MongoClient.connect(config.db_url)
                  .then( function( client ) {
                      var db = client.db("productPrices");

                      // find query is broken for some reason
                      return db.collection("productPrices").find(
                          { "product_id": product_id }
                      ).toArray();
                  }).then (function (result) {
                      if (result[0]) {
                          price_obj = result[0]['current_price'];
                      }
                      return redsky.search(
                          product_id,
                          config.redsky_host,
                          config.redsky_path
                      )
                  }).then( function (name) {
                      // then bundle them together into a json object
                      product_object = {
                          "id":req.params.id,
                          "name": name,
                          "current_price": price_obj
                      };

                      // and return to the user
                      res.json(product_object);
                  }).catch (function (err) {
                      console.log(err);
                  });
          }
        )
    .put( function (req, res)
          {
              // call a function to break up req and update price in
              // Mongo

              // send updated object back to caller
              res.send("Updated");
          }
        )

app.listen(3000, () => console.log('MyRetail pricing app is running.'))
