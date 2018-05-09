var rp = require('request-promise');

var redsky = {
    search: function (product_id, host, path, price) {
        console.log("DEBUG: in the search function");
        // Get the location
        var external_source = host + path + product_id;
        console.log("DEBUG: external source is " + external_source);

        var name = "";
        // Set up the request
        var request_options = {
            uri: external_source,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        }
        return rp(request_options)
            .then(function (body) {
                if (typeof(body.product.item.product_description) != 'undefined') {
                    product_name = body.product.item.product_description.title;
                }
                else { product_name = ""; }
                console.log(product_name);
                return product_name;
            })
            .catch(function (err) {
                console.log("DEBUG: error connecting to Red Sky API");
            });        
    }
};

module.exports = redsky;
