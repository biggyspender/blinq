## A strongly typed TypeScript implementation of Microsoft dotnet's LINQ to Objects using ES6 iterables.

With the advent of javascript iterators and generators, its possible to pipe sequences through a bunch of transformations without materializing collections (arrays) for the intermediate steps. This library attempts to recreate the dotnet linq-to-objects api to provide a number of standard operations on iterable sequences.

The following operations are available, and the user can optionally supply their own `EqualityComparer` (implementing `equals` and `getHashCode`) when using the set-based operations.



```aggregate, all, any, append, average, concat, count, defaultIfEmpty, distinctBy, distinct, elementAt, except, firstOrDefault, first, flatten, forEach, fullOuterGroupJoin, fullOuterJoin, groupAdjacent, groupBy, groupJoin, intersect, isSubsetOf, isSupersetOf, join, lastOrDefault, last, leftOuterJoin, maxBy, max, minBy, min, orderBy / orderByDescending / thenBy / thenByDescending, preprend, reverse, selectMany, select, sequenceEqual, singleOrDefault, single, skip, skipWhile, sum, take, takeWhile, toArray, toLookup, toMap, toSet, union, where, zipAll, zip```

[![Build Status](https://travis-ci.org/biggyspender/blinq.svg?branch=master)](https://travis-ci.org/biggyspender/blinq)
[![Coverage Status](https://coveralls.io/repos/github/biggyspender/blinq/badge.svg?branch=master)](https://coveralls.io/github/biggyspender/blinq?branch=master)

NPM package can be downloaded [here](https://www.npmjs.com/package/blinq).

### documentation

Generated documentation can be found at [https://biggyspender.github.io/blinq/](https://biggyspender.github.io/blinq/)

### How?

Import blinq ES6 style:

    import {
      blinq,
      range,
      empty,
      fromGenerator,
      fromSingleValue,
      repeatGenerate,
      repeat,
      EqualityComparer,
      hashString
    } from "blinq";

or nodejs style:

    const {
      blinq,
      range,
      empty,
      fromGenerator,
      fromSingleValue,
      repeatGenerate,
      repeat,
      EqualityComparer,
      hashString
    } = require("blinq")

Now, just wrap your iterable with a call to `blinq(myIterable)`, and start transforming your data:


    const someNumbers = [1, 2, 3, 4];
    const squares = blinq(someNumbers).select(n => n * n);
    for(let v of squares){
        console.log(v);
    }
    
...or if you'd like an array of your results, you can materialize a blinq query with the `.toArray()` method:

    const someNumbers = range(1, 4);
    const squaresBelowTen = someNumbers.select(n => n * n).where(n => n < 10);
    const arr = squaresBelowTen.toArray();
    console.log(arr);
  
or even spread your results into an array:

    const arr2 = [...squaresBelowTen]

### A case-insensitve set, using EqualityComparer<T>

    const names = ["zebra", "antelope", "ardvaark", "tortoise", "turtle", "dog", "frog"]
    const comparer: EqualityComparer<string> = {
        equals: (a, b) => a.toLowerCase() === b.toLowerCase(),
        getHashCode: (x) => hashString(x.toLowerCase())
    }
    const set = blinq(names).toSet(comparer)
    expect(set.has("DOg")).toBeTruthy()

#### More examples:

Let's make a collection of cars:

    const cars = [{
        manufacturer:"Ford",
        model:"Escort"
      },{
        manufacturer:"Ford",
        model:"Cortina"
      },{
        manufacturer:"Renault",
        model:"Clio"
      },{
        manufacturer:"Vauxhall",
        model:"Corsa"
      },{
        manufacturer:"Ford",
        model:"Fiesta"
      },{
        manufacturer:"Fiat",
        model:"500"
      }
    ];
    
...and sort them by manufacturer, and then by model:

    const orderedCars = blinq(cars).orderBy(c => c.manufacturer).thenBy(c => c.model);
    console.log(orderedCars.toArray());
    
Or we could count the number of cars for each manufacturer:

    const carsPerManufacturer = blinq(cars)
      .groupBy(c => c.manufacturer)
      .select(g => ({
        manufacturer:g.key, 
        count:g.count()
      }))
      .orderBy(c => c.manufacturer);
    for(var c of carsPerManufacturer){
      console.log(`${c.manufacturer} : ${c.count}`);
    }

### What next?

The [tests](https://github.com/biggyspender/blinq/tree/master/test) for this project are kept up to date and are the best place to look for other examples.


### acknowledgements

Created using the wonderful [https://github.com/alexjoverm/typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter).
