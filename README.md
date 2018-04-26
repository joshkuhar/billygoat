billygoat
=========

Lightweight, shallow, client-side schema validation. Billygoat helps keep track of documents created for non-relational databases, such as Google Cloud Firestore and Firebase. 

## Installation
`npm install --save billygoat`

## Version

Billygoat **0.1.3** is currently in **beta** and breaking changes may follow with later versions. 

## Documentation

Requests for clarificaiton can be made by opening an issue. Documentation will be updated frequently.

## Usage

When creating a data model with a non-relational database, denormalizing your data is common. Keeping track of your documents and what fields are used in each one can be difficult. Using billygoat to enforce your schema can help reduce the complexity and increase the ease of maintainability of your app.

### Overview
You can use billygoat in three simple steps.

#### 1 Create a new instance  
```
var goat = new billygoat();
```

#### 2 Define your schema for the document
```
goat.defineDocument({
    name: String,
    age: Number,
    id: String
});
```

#### 3 Create your document
The `pass()` method returns your document as JavaScript Object if it matches your schema. 

If your documents values don't match the corresponding key/value type defined in the schema an error will be thrown.
```   
var firstGoat = goat.pass({
    name: "Gruff",
    age: 12,
    id: "g1"
});

console.log(firstGoat); 

// will print JavaScript Object
// {
//    name: "Gruff", 
//    age: 12, 
//    id: "g1" 
// }
```

### In Depth
#### Parameters
Billygoat can take three parameters.

`var goat = new billygoat("goat", glossary, "rigid");`
* All parameters are **optional**
* Pass `null` to omit paramater

#### First Parameter

The first parameter is a `String` that will be included in an error. Passing a string that matches the name of billygoat instance will help in locating the error.

#### Second Paramater
The second parameter is a flat, JavaScript `Object` that represents your **glossary**. If you want to call it a dictionary or associative array that's fine. The **glossary** is the record of all of your field names in your documents. As data is duplicated in your database (denormalized), it helps to keep a list of the field names in your document. 

Only the **glossary's** keys will be checked. You can write a short, descriptive sentence for each value. It's better to make your **glossary** flat and readable and the values succinct, as opposed to nested objects and wordy definitions. 

Billygoat does not check nested objects. 

#### Third Parameter
The third paramter is the optional string `'rigid'`. 

If `'rigid'` is passed in, billygoat will check if the document being created has exactly as many fields as the schema. If `'rigid'` is omitted, it will only throw an error if the document being created has more fields than the schema. 


For example

This will **always** throw an error.
```
goat.defineDocument({
    name: String,
    id: String
});

var firstGoat = goat.pass({
    name: "Gruff",
    id: "g1",
    age: 12
})
```


This will **only** throw an error if `'rigid'` is passed in when instantiated.
```
goat.defineDocument({
    name: String,
    age: Number,
    id: String
});

var firstGoat = goat pass({
    name: "Gruff",
    age: 12
})

```
Omitting `'rigid'` allows for newer documents to have more fields than older documents that were created from a schema with fewer fields. In other words, the default behavior is to allow for documents to grow.

#### Methods

Billygoat has two methods, `defineDocument()` and `pass()`.

#### `defineDocument()`
The `defineDocument()` method takes an Object.

`defineDocument()` defines the schema for the document. It throws an error if a glossary has been passed in **AND** one of the keys does not match to any of the keys in the glossary. 

Billygoat does not check nested documents. This is *intentional* to encourage denormalization. 

You can create separate schemas for nested documents. See the Example.

```
goat.defineDocument({
    name: String,
    age: Number,
    id: String
});
```

#### `pass()` 
The `pass()` method takes an Object.

If the document passed in does not throw an error, the `pass()` method returns a Javascript Object. 

Billygoat throws an error if the types do not match, if the number of fields differ according to 'rigid', or if one or more of the fields are not in the glossary was passed in. 

```
var firstGoat = goat.pass({
    name: "Gruff",
    age: 12,
    id: "g1"
})
```

#### Data Types
The following datatypes are currently validated.

* `String`
* `Number`
* `Date` - The string should be in a format recognized by JavaScript's Date.parse() method.
* `Boolean`
* `Array`
* `Object`

## Example
### Define your glossary
First define your `glossary`.

Again, the `glossary` is a FLAT javascript object that contains key/value pairs of your data field names.

File Name `glossary.js`
```
'use strict';

var glossary = {

    name: "name of document",

    age: "age of goat or troll",

    id: "id associated with the document",

    latitude: "latitude of the event",

    longitude: "longitude of the event",

    mood: "Mood of troll",

    message: "Message delivered by either troll or goat",

    actors: "List of names"
}

module.exports = glossary;
```
### Define your document schema

File Name `billygoats.js`
```
'use strict';

var Billygoat = require('billygoat');

var glossary = require('./glossary');

// create instances of billygoat
var goat = new Billygoat("goat", glossary);
var troll = new Billygoat("troll", glossary);
var bridge = new Billygoat("bridge", glossary);

// define your schemas
goat.defineDocument({
    name: String,
    age: Number,
    id: String,
    message: String,
    events: Array
});

troll.defineDocument({
    name: String,
    age: Number,
    id: String,
    mood: String,
    message: String,
    events: Array
});

bridge.defineDocument({
    name: String,
    longitude: Number,
    latitude: Number,
    id: String,
    actors: Array
});

// export your schemas
exports.goat = goat;
exports.troll = troll;
exports.bridge = bridge;
```

### Pass
Finally, create a document that matches the schema.

File Name `index.js`
```
'use strict';

var Story = require('./billygoats');

var firstGoat = Story.goat.pass({
    name: "Gruff",
    age: 9,
    id: "g1",
    message: "There's a tastier one coming after me.",
    events: ["bridge1"]
});

var secondGoat = Story.goat.pass({
    age: 15,
    name: "Gruff",
    id: "g2",
    message: "The next one is fatter.",
    events: ["bridge1"]
});

var thirdGoat = Story.goat.pass({
    name: "Gruff",
    age: 25,
    id: "g3",
    message: "Hasta la vista, baby.",
    events: ["bridge1"]
})

var troll = Story.troll.pass({
    name: "Mr. Troll",
    age: 438,
    id: "t1",
    message: "I'm hungry.",
    mood: "grumpy",
    events: ["bridge1"]
})

var stonyBridge = Story.bridge.pass({
    name: "Stony Bridge",
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
 
### Example With Google Cloud Firestore
If you are using Google Cloud Firestore, you can update all of the documents to the database with a batched write.
```
// Get a new write batch
var batch = db.batch();


// Set the goat documents
var g1 = db.collection("actors").doc(firstGoat.id);
batch.set(g1, firstGoat);

var g2 = db.collection("actors").doc(secondGoat.id);
batch.set(g2, secondGoat);

var g3 = db.collection("actors").doc(secondGoat.id);
batch.set(g3, thirdgoat);

// Set the troll document
var t1 = db.collection("actors").doc(troll.id);
batch.set(t1, troll);


// Set the bridge document
var b1 = db.collection("events").doc(stonyBridge.id);
batch.set(b1, stonyBridge);

// Commit the batch
batch.commit().then(function () {
    // ...
});
```

## Testing
Testing will be released with version 0.2.0

## Contributing
Contributors are welcome for bugs and features. Please submit a pull request. 

