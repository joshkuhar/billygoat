'use strict';

var expect = require('chai').expect;

var billygoat = require('billygoat');

var testGlossary = {
    name: String,
    age: Number,
    doc: Object,
    listOfGoats: Array,
    date: Date,
    hasHorns: Boolean
}

var goat = new billygoat('goat',testGlossary);

describe('#goat', function() {

    it('should return without an error', function() {
        var result = goat.defineDocument({
            name: String,
            hasHorns: Boolean
        });
        expect(result).to.equal(undefined);
    });

    it('should throw an error stating Missing from glossary', function() {
        expect(function() {
            goat.defineDocument({
                user: String
            })
        }).to.throw('Missing user from glossary. Make sure to define property in glossary.');
    });
    
    it('should return an object', function() {
        var result = goat.createDocument({
            name: "Billy",
            hasHorns: true
        });
        expect(result).to.be.an('object');
        expect(result.name).to.be.an('string');
        expect(result.hasHorns).to.be.an('boolean');
    });

});

var goats = new billygoat('goats',testGlossary);

describe('#goats', function() {

    it('should return without an error', function() {
        var result = goat.defineDocument({
            listOfGoats: Array
        });
        expect(result).to.equal(undefined);
    });

    it('should return an array', function() {
        var result = goat.createDocument({
            listOfGoats: ["Gruff", "Gruff"]
        });
        expect(result.listOfGoats).to.be.an('array');
    });

});

var event = new billygoat('event',testGlossary);
var eventDate = new Date('December 17, 1995 03:24:00');

describe('#event', function() {

    it('should return without an error', function() {
        var result = event.defineDocument({
            date: Date
        });
        expect(result).to.equal(undefined);
    });

    it('should return a property with the Date type', function() {
        var result = event.createDocument({
            date: eventDate
        });
        expect(result.date).to.be.a('date');
    });

});

