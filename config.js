var config = {
    expressPort: 3000,
    db_url: "mongodb://localhost:27017",
    redsky_host: "https://redsky.target.com/",
    redsky_path: "v2/pdp/tcin/",
    client: {
        mongodb: {
            defaultDatabase: "productPrices",
            defaultCollection: "products",
            defaultUri: "mongodb://localhost:27017"
        }
    }
};

module.exports = config;
