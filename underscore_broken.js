(function() {
  
  // Call iterator(value, key, obj) for each element of obj
  // each([1,2,3], function(value,key))
  // obj = array, iterator = function()
  var each = function(obj, iterator) {
    if(obj instanceof Array) {
      for(var i=0; i<obj.length; i++) {
        iterator(obj[i],i,obj);
      }
    } else if(obj instanceof Object) {
      for(var i in obj) {
        if(obj.hasOwnProperty(i)) iterator(obj[i],i,obj);
      }
    }
  };

  // Determine if the array or object contains a given value (using `===`).
  var contains = function(obj, target) {
    var found = false;
    each(obj,function(value,key) {
      if(value === target) found = true;
    });
    return found;
  };

  // Return the results of applying an iterator to each element.
  var map = function(array, iterator) {
    var output = [];
    if(array == null) return output;
    each(array,function(value,key) {
      output.push(iterator(value,key,array));
    });
    return output;
  };

  // Takes an array of objects and returns and array of the values of
  // a certain property in it. E.g. take an array of people and return
  // an array of just their ages
  var pluck = function(obj, property) {
    var output = [];
    each(obj,function(value,key) {
      if(value.hasOwnProperty(property)) output.push(value[property]);
    });    
    return output;
  };

  // Return an array of the last n elements of an array. If n is undefined,
  // return just the last element.
  var last = function(array, n, guard) {
    var output = [];
    if(array == null) return null;
    if(guard || arguments.length == 1 || n == null) return array[array.length-1];
    if(n > array.length) return array;
    
    for(var i=array.length-1; i>array.length-n-1; i--) {
      output.unshift(array[i]);
    }
    return output;
  };

  // Like last, but for the first elements
  var first = function(array, n, guard) {
    var output = []
    
    if(array == null) return null;
    if(guard || arguments.length == 1 || n == null) return array[0];
    if(n > array.length) return array;
    
    for(var i=0; i<n; i++) {
      output.push(array[i]);
    }
    return output;
  };

  // Reduces an array or object to a single value by repetitively calling
  // iterator(previousValue, item) for each item. previousValue should be
  // the return value of the previous iterator call.
  // 
  // You can pass in an initialValue that is passed to the first iterator
  // call. Defaults to 0.
  //
  // Example:
  //   var numbers = [1,2,3];
  //   var sum = _.reduce(numbers, function(previous_value, item){
  //     return previous_value + item;
  //   }, 0); // should be 6
  //
  var reduce = function(obj, iterator, initialValue) {
    // loop through items and add to local sum
    // if hit a branch, add reduce(branch) to local sum
    initialValue |= 0;
    var output = initialValue;
    
    each(obj,function(value,key) {
      output = iterator(output, value);
    });
    return output;
  };

  // Return all elements of an array that pass a truth test.
  var select = function(array, iterator) {
    if(array == null) return null;
    output = [];
    each(array,function(value,key) {
      if(iterator(value)) output.push(value);
    });
    return output;
  };

  // Return all elements of an array that don't pass a truth test.
  var reject = function(array, iterator) {
    if(array == null) return null;
    output = [];
    each(array,function(value,key) {
      if(!iterator(value)) output.push(value);
    });
    return output;
  };

  // Determine whether all of the elements match a truth test.
  var every = function(obj, iterator) {
    if(obj == null) return null;
    if(iterator == null) iterator = function(x) { return x; }
    output = true;
    each(obj,function(value,key) {
      if(!iterator(value)) output = false;
    });
    return output;
  };

  // Determine whether any of the elements pass a truth test.
  var any = function(obj, iterator) {
    if(obj == null) return null;
    if(iterator == null) iterator = function(x) { return x; }
    output = false;
    each(obj,function(value,key) {
      if(iterator(value)) output = true;
    });
    return output;
  };

  // Produce a duplicate-free version of the array.
  var uniq = function(array) {
    output = [];
    if(array == null) return output;
    for(var i=0; i<array.length; i++) {
      if(output.indexOf(array[i]) == -1) output.push(array[i]);
    }
    return output;
  };

  // Return a function that can be called at most one time. Subsequent calls
  // should return the previously returned value.
  var once = function(func) {
    if(func == null) return null;
    var privateFuncFirstValue;
    var privateUsed = false;
    return function() {
      if(!privateUsed) {
        privateUsed = true;
        privateFuncFirstValue = func();//this.apply(func,arguments);
        return func;
      }
      else {
        return privateFuncFirstValue;
      }
    }
  };

  // Memoize an expensive function by storing its results. You may assume
  // that the function takes only one argument and that it is a primitive.
  //
  // Memoize should return a function that when called, will check if it has
  // already computed the result for the given argument and return that value
  // instead if possible.
  var memoize = function(func) {
    if(func == null) return null;
    if(typeof func == 'string') return func;
    var privateValues = {};
    return function(key) {
      if(privateValues[key] && privateValues.hasOwnProperty(key)) return privateValues[key];
      else {
        privateValue = func(key);
        privateValue[key] = privateValue;
        return privateValue;
      }
    }
  };


  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  //
  // The arguments for the original function are passed after the wait
  // parameter. For example _.delay(someFunction, 500, 'a', 'b') will
  // call someFunction('a', 'b') after 500ms
  var delay = function(func, wait) {
    var args = Array.prototype.slice.call(arguments,2);
    setTimeout(function() {
      func.call(this,args);
    },wait);
  };

  // Extend a given object with all the properties of the passed in 
  // object(s).
  //
  // Example:
  //   var obj1 = {key1: "something"};
  //   _.extend(obj1, {
  //     key2: "something new",
  //     key3: "something else new"
  //   }, {
  //     bla: "even more stuff"
  //   }); // obj1 now contains key1, key2, key3 and bla
  //
  var extend = function(obj) {
    if(obj == null) return obj;

    var args = Array.prototype.slice.call(arguments,1);
    // loop thru propertiesPassedIn and attach to obj
    each(args,function(object) {
      each(object,function(value,key) {
        obj[key] = value;
      });
    });
    return obj;
  };

  // Like extend, but doesn't ever overwrite a key that already
  // exists in obj
  var defaults = function(obj) {
    if(obj == null) return obj;

    var args = Array.prototype.slice.call(arguments,1);
    // loop thru propertiesPassedIn and attach to obj
    each(args,function(object) {
      each(object,function(value,key) {
        if(!obj.hasOwnProperty(key)) obj[key] = value;
      });
    });
    return obj;
  };

  // Flattens a multidimensional array to a one-dimensional array that
  // contains all the elements of all the nested arrays.
  //
  // Hints: Use Array.isArray to check if something is an array
  //
  var flatten = function(nestedArray, result) {
    if(nestedArray == null) return obj;
    var output = [];
    var inner_flatten = function(input_array){
      each(input_array,function(value,key) {
        !Array.isArray(value) ? output.push(value) : inner_flatten(value);
      });
    };
    inner_flatten(nestedArray);

    return output;
  };

  // Sort the object's values by a criterion produced by an iterator.
  // If iterator is a string, sort objects by that property with the name
  // of that string. For example, _.sortBy(people, 'name') should sort
  // an array of people by their name.
  var sortBy = function(obj, iterator) {
    if(obj == null) return null;
    if(iterator == null) return obj;
    if(typeof iterator == 'string') {
      return obj.sort(function(a,b) {
        if(b[iterator] === undefined || a[iterator] > b[iterator]) { return 1; }
        else if(a[iterator] === undefined || a[iterator] < b[iterator]) { return -1; }
        else { return 0; }
      });
    } else {
      return obj.sort(function(a,b) {
        if(b === undefined || iterator(a) > iterator(b)) { return 1; }
        else if(a === undefined || iterator(a) < iterator(b)) { return -1; }
        else { return 0; }
      });
    }
  };

  // Zip together two or more arrays with elements of the same index 
  // going together.
  // 
  // Example:
  // _.zip(['a','b','c','d'], [1,2,3]) returns [['a',1], ['b',2], ['c',3]]
  var zip = function() {
    var args = Array.prototype.slice.call(arguments,0);
    // define an empty array
    var output = [];
    var n = 0;
    for(var i=0; i<args.length; i++) {
      if(args[i].length > n) n = args[i].length;
    }
    for (var i=0; i<n; i++) {
      var placeholder = [];
      for (var j=0; j<args.length; j++){
        placeholder.push(args[j][i]);
      }
      output.push(placeholder);
    }
    return output;
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  var intersection = function(array) {
    var output = [];
    var num_arrays = arguments.length;

    // convert arrays to hash where key == int and value == true/false
    array = Array.prototype.slice.call(arguments,0);
    // unique every subarray
    for(var i=0; i<num_arrays; i++) {
      array[i] = uniq(array[i]);
    }

    // flatten everything
    array = flatten(array);

    var placeholder = {};
    for(var i=0; i<array.length; i++) {
      if (placeholder[array[i]] === undefined) placeholder[array[i]] = 1;
      else{
        placeholder[array[i]] += 1;
        if (placeholder[array[i]] === num_arrays) output.push(array[i]);
      }
    }
    return output;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = function(array) {
    var output = [];
    var num_arrays = arguments.length;
    diffArray = Array.prototype.slice.call(arguments,1);

    diffArray = flatten(diffArray);
    diffArray = uniq(diffArray);

    // found = {};
    for(var i=0; i<arguments[0].length; i++) {
      if(!contains(diffArray,arguments[0][i])) output.push(arguments[0][i]);
    }
    return output;
  };

  // Generate an array consisting of a range of numbers
  var range = function(whatever) {
    var output = [];
    for (var i=0; i<whatever; i++) {
      output.push(i);
    }
    console.log(output);
    return output;
  }

  // Shuffle an array.
  var shuffle = function(obj) {
    output = obj.slice();
    for(var i=0; i<obj.length; i++) {
      var rand = Math.floor(Math.random()*10);
      var temp = output[i];
      output[i] = output[rand]
      output[rand] = temp;
    }
    return output;
  };

  // EXTRA CREDIT:
  // Return an object that responds to chainable function calls for
  // map, pluck, select, etc
  //
  // See README for details
  var chain = function(obj) {
  };

  // EXTRA CREDIT:
  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time.
  //
  // See README for details
  var throttle = function(func, wait) {
  };

  this._ = {
    each: each,
    contains: contains,
    map: map,
    pluck: pluck,
    last: last,
    first: first,
    reduce: reduce,
    select: select,
    reject: reject,
    every: every,
    any: any,
    uniq: uniq,
    once: once,
    memoize: memoize,
    delay: delay,
    extend: extend,
    defaults: defaults,
    flatten: flatten,
    sortBy: sortBy,
    zip: zip,
    intersection: intersection,
    difference: difference,
    range: range,
    shuffle: shuffle,
    chain: chain,
    throttle: throttle
  };


}).call(this);
