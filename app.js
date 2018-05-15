const express = require('express')
const app = express()
var config = require('./config');
var redsky = require('./redsky');
var rp = require('request-promise');
var MongoClient = require('mongodb').MongoClient;

app.get('/', (req, res) => res.send('To use this application, search by product ID at http://localhost:3000/products/:id.  Try 16696652 to start.'))

app.route('/dbsetup')
    .get( function (req, res) {
        var sample_data = [
                    {
                        "product_id": 15117729,
                        "current_price": {"value": "5.14", "currency_code": "USD"}
                    },
                    {
                        "product_id": 16483589,
                        "current_price": {"value": "17.30", "currency_code": "USD"}
                    },
                    {
                        "product_id": 16696652,
                        "current_price": {"value": "8.99", "currency_code": "USD"}
                    },
                    {
                        "product_id": 16752456,
                        "current_price": {"value": "3.21", "currency_code": "USD"}
                    },
                    {
                        "product_id": 15643793,
                        "current_price": {"value": "9.00", "currency_code": "USD"}
                    }
        ];
        console.log("DEBUG: setting up database.");
        MongoClient.connect(config.db_url)
            .then (function ( client ) {
                var db = client.db("productPrices");
                // Drop old data first to avoid duplicates.
                db.collection('productPrices').drop();
                // Add the basic set of sample data
                db.collection("productPrices").insertMany(sample_data, function(err, result) {
                    if (err){
                        console.log(err);
                    }
                    console.log("Inserted 5 products.");
                    res.json(sample_data);
                })
            })
            .catch (function (err) {
                console.log(err);
                error_object = {
                    "error_message": "Sorry, there was an error processing your request.",
                    "error_body": err
                }
                res.json(error_object);
            });
    })

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

                      return db.collection("productPrices").find(
                          { "product_id": product_id }
                      ).toArray();
                  }).then (function (result) {
                      if (result[0]) {
                          price_obj = result[0]['current_price'];
                      }
                      // Check external source for name
                      return redsky.search(
                          product_id,
                          config.redsky_host,
                          config.redsky_path
                      )
                  }).then( function (name) {
                      // Catch error from external source
                      if (! name) {
                          name = "";
                      }
                      
                      // Then bundle them together into a json object
                      product_object = {
                          "id":req.params.id,
                          "name": name,
                          "current_price": price_obj
                      };

                      // And return to the user
                      res.json(product_object);
                  }).catch (function (err) {
                      error_object = {
                          "error_message": "Sorry, there was an error processing your request.",
                          "error_body": err
                      }
                      res.json(error_object);
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


module.exports = app
