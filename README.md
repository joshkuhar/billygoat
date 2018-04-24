billygoat
=========

Lightweight, shallow, client-side schema validation.

## Installation
`npm install --save billygoat`

## Version 0.1.0
### Beta
Billygoat is currently in *beta* and breaking changes may follow with later versions. 

### Documentation
Documentation will be updated frequently. For now, requests for clarificaiton can be made by opening an issue.

#### Contributors
Contributors are welcome for bugs and features. Please clone the library and submit a pull request. 

## Usage
Billygoat helps keep track of documents created for non-relational databases, such as Google Cloud Firestore and Firebase. 

When creating a data model with a non-relational database, denormalizing your data is common.

When using a client side query langauge such as Cloud Firestore, keeping track of your documents can take getting used to. Using billygoat to enforce your schema can help reduce the complexity and maintainability of your app.

## Initialize
Create a new instance like so  `var goat = new billygoat('goat', glossary, 'rigid')`

### Parameters
* All parameters are optional
* Pass `null` to omit

#### First Parameter
The first parameter is a `String` that will be included in an error. Matching the name to the instance will help locating the error.

#### Second Paramater
The second parameter is a flat, JavaScript `Object` that represents the glossary. The glossary is the record of all of your field names for your documents.

#### Third Parameter
The third paramter is the optional string 'rigid'. If passed in, billygoat will check if the document being written has as many fields as the schema. If omitted, it will throw an error only if the document being written has more than the schema. Omitting 'rigid' allows for newer documents to have more fields than legacy documents.

## Methods
#### `defineDocument()`
Defines the schema for the document. Throws an error if glossary has been passed in, and the fields do not match. It remains shallow and will not check nested documents. This is intentional to encourage denormalization. You can create separate schemas for nested documents. See the Example.

```
goat.defineDocument({
        name: String,
        age: Number,
        id: String
    })
```

#### `pass()`
Returns a JavascriptObject if the types match. Throws an error if the types do not match, if the number of fields differ according to 'rigid', or if one or more of the fields are not in the glossary, if the glossary was passsed in. 

```
goat.pass({
        name: "Gruff",
        age: 12,
        id: "g1"
    })
```

## Example
#### Glossary
First define your `glossary`. Creating a different file striclty for the glossary is recommended. 

The `glossary` is a FLAT javascript object that contains key/value pairs of your data field names. This will help prevent unintended, different naming.

File Name `glossary.js`
```
'use strict';

var glossary = {
    name: "name of goat or troll",
    age: "age of goat or troll",
    id: "id associated with the document",
    latitude: "latitude of the event",
    longitude: "longitude of the event",
    mood: "Mood of troll",
    message: "Message delivered by either troll or goat",
    actors: "List of names"
}

module.exports = glossary
```
#### Schema
Next, define your schema. Again, its helpful to create a separate file for the schema. Below, there are three document types defined. A `billygoat`, `troll`, and `bridge`.

The following datatypes are currently validated.

* `String`
* `Number`
* `Date` - The string should be in a format recognized by JavaScript's Date.parse() method.
* `Boolean`
* `Array`
* `Object`

File Name `billygoats.js`
```
'use strict';

var Billygoat = require('billygoat');

var glossary = require('./glossary');

var goat = new Billygoat("goat", glossary);
var troll = new Billygoat("troll", glossary);
var bridge = new Billygoat("bridge", glossary);

goat.defineDocument({
    name: String,
    age: Number,
    id: String,
    message: String
});

troll.defineDocument({
    name: String,
    age: Number,
    id: String,
    mood: String,
    message: String
});

bridge.defineDocument({
    name: String,
    longitude: Number,
    latitude: Number,
    id: String,
    actors: Object
});

exports.goat = goat;
exports.troll = troll;
exports.bridge = bridge;
```

#### Pass
The last thing is to pass an object that matches the schema.

File Name `index.js`
```
'use strict';

var Story = require('./billygoats');

var firstGoat = Story.goat.pass({
    name: "Gruff",
    age: 9,
    id: "g1",
    message: "There's a tastier one coming after me."
});

var secondGoat = Story.goat.pass({
    age: 15,
    name: "Gruff",
    id: "g2",
    message: "The next one is fatter."
});

var thirdGoat = Story.goat.pass({
    name: "Gruff",
    age: 25,
    id: "g3",
    message: "Hasta la vista, baby."
})

var troll = Story.troll.pass({
    name: "Mr. Troll",
    age: 438,
    id: "t1",
    message: "I'm hungry.",
    mood: "grumpy"
})

var stoneyBridge = Story.bridge.pass({
    name: "Stoney Bridge",
    id: "bridge1",
    latitude: 40.071881,
    longitude: -75.225580,
    actors: [firstGoat, secondGoat, thirdGoat, troll]
});

console.log(troll.message); // I'm hungry.
console.log(firstGoat.message); // There's a tastier one coming after me.
console.log(troll.message); // I'm hungry.
console.log(secondGoat.message); // The next one is fatter.
console.log(troll.message); // I'm hungry.
console.log(thirdGoat.message); // Hasta la vista, baby.
```
If you are using Google Cloud Firestore, you can update all of the documents to the database with a batched write. 


