'use strict';

var billygoat = function(name, glossary, rigid) {    

    var billygoat = {};
    
    var billygoatName = name || 'The document';

    this.defineDocument = function(documentToDefine) {
        
        if ( glossary ) {
            checkGlossary(documentToDefine);
        }

        billygoat = documentToDefine;
    }

    var printMissingKeys = function(arrayOfKeys) {
        return arrayOfKeys.join(", ");
    }

    var checkGlossary = function(documentToCompare) {
        var keysGlossary = Object.keys( glossary );
        var keysDocument = Object.keys( documentToCompare );
        
        var documentLength = keysDocument.length;
        var keysFound = 0;

        for( var entry in keysGlossary ) {

            if ( keysFound === documentLength ) {               
                break;
            }

            for ( var key in keysDocument ) {
                if (keysGlossary[entry] === keysDocument[key] ) {
                    keysDocument.splice(key, 1);
                    keysFound++;
                    break;
                }
            }

        }

        if( keysDocument.length > 0 ) {
            
            throw "Missing " + printMissingKeys(keysDocument) + " from glossary. Make sure to define property in glossary.";

        } else {

            return 1;
        }

    }
    
    var checkLengthsMatch = function(arrayOfKeysFromDocumentToCheck) {

        var first = arrayOfKeysFromDocumentToCheck.length;
        var second = Object.keys(billygoat).length;         

        if( first > second ){            
            throw "The " + billygoatName + " has more properties than expected.";
        }

        if ( rigid==="rigid" && first < second ){
           throw "The " + billygoatName + " has less properties than expected.";
        }

    }

    var checkOtherTypes = function(value, key) {

        var name = billygoat[key].name.toLowerCase();

        if( typeof value === 'object' ) {         
            
            if( name === 'array' && value.length ) {

                return name;

            } else if ( name === 'date' && Object.prototype.toString.call(value) === '[object Date]' ) {

                return name;

            }
        }

        return -1;
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

    this.createDocument = function(documentToCreate) {

        if ( glossary ) {
            checkGlossary(documentToCreate);
        }

        return check(documentToCreate); 
    }

}

module.exports = billygoat;






