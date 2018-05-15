var request = require('supertest'),
    express = require('express'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    chaiAsPromised = require('chai-as-promised');

var expect = chai.expect;

chai.use(chaiHttp);

var app = require('../app.js');

describe('GET', function(done) {
    it('responds with a successful status code from the index', function(done) {
        request(app)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                done();
            });
    });

    it('responds to a request with the correct product id', function(done) {
        // A product id that is not in our seed data and is (likely) not
        // in the database
        test_product_id = '1234';
        request(app)
            .get('/products/' + test_product_id)
            .set('Accept', 'text/json')
            .expect(200)
            .end(function(err, res) {
                expect(res.body.id).to.contain(test_product_id);
                done();
            });
    });

    it('responds to invalid product id with empty name', function(done) {
        // Product IDs should be integers for external source
        invalid_product_id = 'asdf';
        request(app)
            .get('/products/' + invalid_product_id)
            .set('Accept', 'text/json')
            .expect(200)
            .end(function(err, res) {
                expect(res.body.name).to.equal("");
                done();
            });
    });

});

