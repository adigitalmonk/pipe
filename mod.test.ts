import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";

import pipe from "./mod.ts";

function add(x: number, y: number) {
  return x + y;
}

function add2(z: number): number {
  return add(z, 2);
}

Deno.test("the ability to build a chain that steps over a value", () => {
  const adderPipe = pipe(add2, add2);
  assertEquals(adderPipe(1), 5);
});

Deno.test("that having no arguments is valid", () => {
  const pipeline = pipe(
    () => {},
    () => 4,
    (four: number) => {
      assertEquals(four, 4);
      return 5;
    },
  );

  assertEquals(pipeline(), 5);
});

Deno.test("more complicated args and returns", () => {
  function shift([a, b]: [a: number, b: number]) {
    return [a + 1, b + 1];
  }
  const shiftPipe = pipe(shift, shift, shift);

  assertEquals(shiftPipe([1, 2]), [4, 5]);
});

Deno.test("using closures in the chain", () => {
  const stepValue = 5;
  const step = (value: number) => value + stepValue;
  const stepPipe = pipe(step, step, step);

  assertEquals(stepPipe(0), 15);
});

Deno.test("using factory functions in the chain", () => {
  const step = (stepValue: number) => (value: number) => value + stepValue;

  const pipeline = pipe(
    step(2),
    step(3),
    step(5),
  );

  assertEquals(pipeline(0), 10);
});

Deno.test("the chain stops if an error is thrown", () => {
  let addCalls = 0;
  const expectedErrorMessage = "Failed successfully";

  function failEarly() {
    throw new Error(expectedErrorMessage);
  }

  function add3(val: number) {
    addCalls += 1;
    return val + 3;
  }

  const eventPipe = pipe(add3, add3, failEarly, add3);
  try {
    eventPipe(1);
  } catch (err) {
    assertEquals(err.message, expectedErrorMessage);
  }

  assertEquals(addCalls, 2);
});

Deno.test("Celcius to Fahrenheit", () => {
  const celciusToFahrenheit = pipe(
    (val: number) => val * 1.8,
    (val: number) => val + 32,
  );

  assertEquals(celciusToFahrenheit(100), 212);
});
