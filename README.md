# fast-deep-resolve


Resolves nested objects and arrays with promises as a single promise. Like Promise.all, but for objects too!

No dependencies and hopefully super fast. If it's not fast, file an issue!

```javascript
const deepResolve = require('fast-deep-resolve')

deepResolve({
    foo: Promise.resolve(['bar'])
}).then(...)
```


