# Pipe

A helper for building simple pipelines of multiple function calls together.

At a high level, the idea is that `pipe` takes a series of functions and creates
a pipeline. The pipeline created will take an argument and pass it through the
given functions one by one, then returning the final result at the end.

The usage section below shows some examples to help explain the idea.

## Installation

This is written for [Deno](https://deno.land), available via GitHub.

```javascript
import pipe from "https://github.com/adigitalmonk/pipe/raw/master/mod.ts";
```

There is nothing specific to Deno for this project (aside from tests), so it
could easily be ported to [Node.js](https://nodejs.org/).

## Usage

### Simple Pipeline

The first argument into `pipe` will be passed into the argument for the pipeline
step. Each functional will always be evaluated in order.

```javascript
const celciusToFahrenheit = pipe(
  (val) => val * 1.8,
  (val) => val + 32,
);

console.log(celciusToFahrenheit(100)); // 212
```

Closures and factory functions can be used for can be used for the piped
functions as a way to provide more arguments.

```javascript
const stepValue = 5;
const step = (value) => value + stepValue;
const pipeline = pipe(step, step, step);
console.log(pipeline(0)); // 15
```

```javascript
const step = (stepValue) => (value) => value + stepValue;

const pipeline = pipe(
  step(2),
  step(3),
  step(4),
);

pipeline(0); // 10
```

### Fail Early

To keep the API simple, a thrown error is the way to escape the pipeline early.

```javascript
const failingPipeline = pipe(
  () => {
    throw new Error("ohnoes!");
  },
  () => {
    console.log("you'll never see this");
  },
);

try {
  failingPipeline();
} catch (err) {
  console.log(err.message); // ohnoes!
}
```
