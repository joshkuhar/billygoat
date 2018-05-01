billygoat
=========

Lightweight, shallow, client-side schema validation. Billygoat helps keep track of documents created for non-relational databases, such as Google Cloud Firestore and Firebase. Simple to understand, simple to use.  

## Installation
`npm install --save billygoat`

## Version

Billygoat is currently in **BETA** and breaking changes may follow with later versions. 

The `pass()` method is now `createDocument()`. The functionality is the same. `pass()` will continue to work but will be deprecated in beta 0.3.0. 

## Documentation

Requests for clarificaiton can be made by opening an issue. Documentation will be updated frequently.

## Usage

When creating a data model with a non-relational database, denormalizing your data is common. Keeping track of your documents and the names of each field can become complex and difficult. Using **billygoat** to enforce your schema can help reduce the complexity and help with the maintainability of your app.

If you are familiar with Mongoose, **billygoat** will be very easy to understand. There are two main differences. First, **billygoat** does not query the database. Second, **billygoat** has an optional step to validate your schema against a glossary. 

## Quick Start
You can use **billygoat** in three simple steps.

#### 1. Create a new instance  
```
var Billygoat = require('billygoat');
var goat = new billygoat();
```

#### 2. Define your document
```
goat.defineDocument({
    name: String,
    id: String,
    age: Number
});
```

#### 3. Create your document
```   
var firstGoat = goat.createDocument({
    name: "Gruff",
    id: "g1",
    age: 12
});

console.log(firstGoat); 
```

## billygoat constructor examples

`var goat1 = new billygoat();`

`var goat2 = new billygoat("goat");`

`var goat3 = new billygoat("goat", glossary);`

`var goat4 = new billygoat("goat", glossary, "rigid");`

## Parameters
When creating an instance of **billygoat**, three optional parameters can be passed in.

`var goat = new billygoat(name, glossary, flag);`

* All parameters are **optional**
* Pass `null` to omit paramater

### Name - first parameter

The first parameter **name** is a `String` that will be included if an error is thrown. Passing a string that matches the name of billygoat instance will help in locating the error. For example, `var firstGoat = new billygoat('goat')` `'goat'` will refer to the variable name `'firstGoat'` when an error is thrown on from one of its methods. 

### Glossary - second parameter
The second parameter **glossary** is a flat, JavaScript `Object` that represents your **glossary**. If you want to call it a dictionary or associative array that's fine. 

The **glossary** is the record of all of your field names in your documents. As data is duplicated in your database (denormalized), it helps to keep a list of the field names you're using in your documents. 

You can write a short, descriptive sentence for each value. It's better to make your **glossary** flat and readable and the descriptions succinct, as opposed to nested objects and wordy definitions. 

For example
```
var glossary = {
    name: "name of document",
    age: "age of goat or troll",
    id: "id associated with the document"
}
```
**NOTE: Billygoat does not check nested objects.**

### 'rigid' - third parameter
The third paramter is the optional string **'rigid'**. 

If **'rigid'** is passed in, billygoat will check if the document being created has exactly as many fields as the schema. If **'rigid'** is omitted, it will only throw an error if the document being created has more fields than the schema. 


For example

This will **ALWAYS** throw an error.
```
goat.defineDocument({
    name: String,
    id: String
});

var firstGoat = goat.createDocument({
    name: "Gruff",
    id: "g1",
    age: 12,
    message: String
})
```
This will **SOMETIMES** throw an error. 
```
goat.defineDocument({
    name: String,
    id: String,
    age: Number,
    message: String,
    events: Array
});

var firstGoat = goat.createDocument({
    name: "Gruff",
    id: String
})

```
The default behavior of **billygoat** is to let the second example pass. 

Billygoat will only throw an error if the string **'rigid'** is passed in as the third argument.

Using **'rigid'** prevents newer documents from having more fields than older documents. Omitting **'ridig'** allows for schemas to grow.

## Methods

Billygoat has two methods, `.defineDocument()` and `.createDocument()`.

### .defineDocument()
The `.defineDocument(<object>)` method takes an object.
```
goat.defineDocument({
    name: String,
    age: Number,
    id: String
});
```
The `.defineDocument()` method defines the **schema** for the document. It throws an error if a **glossary** has been passed in **AND** one of the keys does not match to any of the keys in the glossary. 

* Billygoat does not check nested documents. This is *intentional* to encourage denormalization. 

* You can create separate schemas for nested documents. See the Example at the bottom.

### .createDocument()
The `.createDocument(<object>)` method takes an object and returns the same object that was passed in, if it matches the schema. If it doesn't match the schema, it throws an error.
```
var firstGoat = goat.createDocument({
    name: "Gruff",
    age: 12,
    id: "g1"
})
```

Billygoat throws an error 
* if one or more of the fields are not in the **glossary** was passed in 
* if the value types do not match what was declared in `.defineDocument()` 
* if the number of fields differ according to **'rigid'** 


## Data Types
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

### .createDocument()
Finally, create a document that matches the schema.

File Name `index.js`
```
'use strict';

var Story = require('./billygoats');

var firstGoat = Story.goat.createDocument({
    name: "Gruff",
    age: 9,
    id: "g1",
    message: "There's a tastier one coming after me.",
    events: ["bridge1"]
});

var secondGoat = Story.goat.createDocument({
    age: 15,
    name: "Gruff",
    id: "g2",
    message: "The next one is fatter.",
    events: ["bridge1"]
});

var thirdGoat = Story.goat.createDocument({
    name: "Gruff",
    age: 25,
    id: "g3",
    message: "Hasta la vista, baby.",
    events: ["bridge1"]
})

var troll = Story.troll.createDocument({
    name: "Mr. Troll",
    age: 438,
    id: "t1",
    message: "I'm hungry.",
    mood: "grumpy",
    events: ["bridge1"]
})

var stonyBridge = Story.bridge.createDocument({
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
 
## Example With Google Cloud Firestore
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

## Contributing
Contributors are welcome for bugs and features. Please submit a pull request. 

