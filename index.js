'use strict'

var billygoat = function(glossary) {    

    var billygoat = {}

    this.createDocument = function(documentToDefine) {
        billygoat = documentToDefine
    }

    var checkGlossary = function(params) {
        var keysGloss = Object.keys( glossary )
        var keysParams = Object.keys(params)
    
        for(var defined in keysParams){
            var found = false

            for(var entry in keysGloss){
                if(keysParams[defined] === keysGloss[entry]){
                    found=true;
                    break;
                }
            }

            if(!found){
                throw "Missing property ' " + keysParams[defined] + " '. Make sure to define property in glossary"
            }
        }

        return 1
    }

    var checkLengthsMatch = function(array) {
        var first = array.length;
        var second = Object.keys(billygoat).length 

        if( first > second ){            
            throw "document has more properties than defined"
        } 
        if ( first < second ){
           throw "document has less properties than defined"
        }

    }

    var checkOtherTypes = function(value, key) {

        var name = billygoat[key].name.toLowerCase()

        if( typeof value === 'object' ) {         
            
            if( name === 'array' && value.length ) {
                
                return name

            } else if ( name === 'date' && Object.prototype.toString.call(value) === '[object Date]' ) {
                
                return name

            } else {

                return -1

            }

        } else {

            return -1
            
        }
    }

    var checkDocument = function(value, key) {

        var name = billygoat[key].name.toLowerCase()
 
        if( typeof value !== name ) {
           
            return checkOtherTypes( value, key ) 

        } else {

            return name
        }
    }

    var check = function(documentToCheck) {
        var keys = Object.keys(documentToCheck)
        
        checkLengthsMatch( keys )

        for (var i in keys) {
            var key = keys[i]
            
            if ( checkDocument( documentToCheck[key], key ) < 0 ) {
                throw "property '" + key + "' is supposed to be a '" + billygoat[key].name + "'"
            }
        }
        
        return documentToCheck
      
    }

    this.pass = function(documentToPass) {

        if ( glossary ) {
            checkGlossary(documentToPass)            
        }

        return check(documentToPass)                     
    }    
}

module.exports = billygoat






