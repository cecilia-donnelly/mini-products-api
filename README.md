# README

First, gather the requirements for this application.  You will need Node
JS, the npm package manager, and Mongo, a NoSQL database.

On a Debian system with Node and npm in place, the following works:

    $ sudo apt-get install mongodb nodejs npm
    
    $ cd /location/of/this/repository
    # This will install the upstream dependencies in package.json
    $ npm install
    $ node server.js

You should see "MyRetail pricing app is running." in the console.

## Sample data

__Warning: Following these instructions will clear any existing data
from your database.__

To seed the database, navigate to localhost:3000/dbsetup in your browser
with the application running, or run `curl
http://localhost:3000/dbsetup`. You should see a set of product ids and
prices.  This is the sample data which has been inserted into the
database.

## Config

Set up your specific configuration in config.js.

    $ cp config.js.tmpl config.js

Edit config.js with the hostname and path to your external API.

## Update prices

To update a price, send a `PUT` request to an endpoint with the given ID, like so:

    $ curl -X PUT -H "Content-Type: application/json" -d @updated-price.json http://localhost:3000/products/16696652

The contents of updated-price.json should look something like:

```
{
    "updated_price": {
        "value": "15.99",
        "currency_code": "USD"
    }
}
```

## Testing todo list

Run the tests with `npm test`.

- [x] Check that get returns something
- [x] Check that we return a result even with partial information (missing
  price, missing name)
- [ ] Check that the price information retrieved from the db is correct
- [ ] Check that external product ID matches internal product ID in each
  response


## Production recommendations
- Use `forever` to run the application
- Reduce calls to external source
- Add authn/authz
