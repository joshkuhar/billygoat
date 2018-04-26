'use strict';

var billygoat = function(name, glossary, rigid) {    

    var billygoat = {};
    
    var billygoatName = name || 'The document';

    this.defineDocument = function(documentToDefine) {
        
        if ( glossary ) {
            checkGlossaryWhenCreating(documentToDefine);
        }

        billygoat = documentToDefine;
    }

    var checkGlossaryWhenCreating = function(params) {
        var keysGloss = Object.keys( glossary );
        var keysParams = Object.keys( params );
    
        for(var defined in keysParams){
            var found = false;

            for(var entry in keysGloss){
                if(keysParams[defined] === keysGloss[entry]) {
                    found=true;
                    break;
                }
            }

            if(!found){
                throw "Missing " + keysParams[defined] + " from glossary. Make sure to define property in glossary.";
            }
        }

        return 1;
    } 

    var checkLengthsMatch = function(arrayOfKeysFromDocumentToCheck) {

        var first = arrayOfKeysFromDocumentToCheck.length;
        var second = Object.keys(billygoat).length;         

        if( first > second ){            
            throw "The " + billygoatName + " has more properties than expected.";
        }

        if ( rigid==="rigid" && first < second ){
           throw "The " + billygoatName + " has has less properties than expected.";
        }

    }

    var checkOtherTypes = function(value, key) {

        var name = billygoat[key].name.toLowerCase();

        if( typeof value === 'object' ) {         
            
            if( name === 'array' && value.length ) {

                return name;

            } else if ( name === 'date' && Object.prototype.toString.call(value) === '[object Date]' ) {

                return name;

            } else {

                return -1;
            }

        } else {

            return -1;            
        }
    }

    var checkDocument = function(value, key) {
        var name = billygoat[key].name.toLowerCase();
 
        if( typeof value !== name ) {
           
            return checkOtherTypes( value, key ); 

        } else {

            return name;
        }
    }

    var check = function(documentToCheck) {
        var keys = Object.keys(documentToCheck);
        
        checkLengthsMatch( keys );

        for (var i in keys) {
            var key = keys[i];
            
            if ( checkDocument( documentToCheck[key], key ) < 0 ) {
                throw "The property " + key + ": '" + glossary[key] + ".' is supposed to be a " + billygoat[key].name;
            }
        }
        
        return documentToCheck;
      
    }

    this.pass = function(documentToPass) {

        if ( glossary ) {
            checkGlossaryWhenCreating(documentToPass);
        }

        return check(documentToPass);                     
    }    
}

module.exports = billygoat;






