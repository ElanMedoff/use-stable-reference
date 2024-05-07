# use-stable-reference

Simple React hooks to access referentially stable, up-to-date versions of non-primitives.

[![version](https://img.shields.io/npm/v/use-stable-reference)](https://www.npmjs.com/package/use-stable-reference)
[![bundle size](https://img.shields.io/bundlephobia/minzip/use-stable-reference)](https://bundlephobia.com/package/use-stable-reference)
[![downloads per week](https://img.shields.io/npm/dw/use-stable-reference)](https://www.npmjs.com/package/use-stable-reference)
[![package quality](https://packagequality.com/shield/use-stable-reference.svg)](https://packagequality.com/#?package=use-stable-reference)
[![license](https://img.shields.io/npm/l/use-stable-reference)](https://github.com/ElanMedoff/use-stable-reference/blob/master/LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies%20-%200%20-%20green)](https://github.com/ElanMedoff/use-stable-reference/blob/master/package.json)

## Basic usage

```tsx
import { useStableCallback, useStableValue } from "use-stable-reference";

function Library({ callback, value }) {
  const stableCallback = useStableCallback(callback);
  const getStableValue = useStableValue(value);

  useEffect(() => {
    // safe to put in dependency arrays!
  }, [stableCallback, getStableValue]);
}
```

`use-stable-reference` really shines for library authors or for those writing reusable code. With a library-consumer relationship, the library author can't reasonably expect that the consumer will preemptively wrap any callbacks in a `useCallback`, or any referentially unstable values in a `useMemo`. This leaves the author with a few possible choices of how to handle consumer-provided non-primitive arguments:

1. Leave them out of any dependency arrays, and ignore any React linter warnings/errors
2. Leave them in the dependency arrays, expecting that the effects / memoizations will run every render
3. Wrap them in a `useStableCallback`/`useStableValue`

With option 3, the returned callback/value-getter are referentially stable, can safely be used in dependency arrays, and are guaranteed to always be up-to-date if the underlying option ever changes! 🎉

## `useStableCallback`

`useStableCallback` accepts one argument, a callback of type: `(...args: any[]) => any`

`useStableCallback` returns an up-to-date, referentially stable callback.

## `useStableValue`

`useStableValue` accepts one argument, a value of type: `unknown`

`useStableValue` returns a referentially stable callback that returns an up-to-date copy of the argument.
