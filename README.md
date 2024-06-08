# use-stable-reference

Simple React hooks to access referentially stable, up-to-date versions of non-primitives.

[![version](https://img.shields.io/npm/v/use-stable-reference)](https://www.npmjs.com/package/use-stable-reference)
[![bundle size](https://img.shields.io/bundlephobia/minzip/use-stable-reference)](https://bundlephobia.com/package/use-stable-reference)
[![downloads per week](https://img.shields.io/npm/dw/use-stable-reference)](https://www.npmjs.com/package/use-stable-reference)
[![license](https://img.shields.io/npm/l/use-stable-reference)](https://github.com/ElanMedoff/use-stable-reference/blob/master/LICENSE)
[![dependencies](https://img.shields.io/badge/dependencies%20-%200%20-%20green)](https://github.com/ElanMedoff/use-stable-reference/blob/master/package.json)

<!-- a hack to get around github sanitizing styles from markdown -->
<br>
<p align="center">
    <img src="https://elanmed.dev/npm-packages/use-stable-reference-logo.png" width="400px" />
</p>

## Basic usage

```tsx
import { useStableCallback, useStableValue } from "use-stable-reference";

function Library({ unstableCallback, unstableValue }) {
  const stableCallback = useStableCallback(unstableCallback);
  const getStableValue = useStableValue(unstableValue);

  useEffect(() => {
    if (/* ... */) {
      stableCallback()
      const stableValue = getStableValue()
    }

    // safe to add to dependency arrays!
  }, [stableCallback, getStableValue, /* ... */]);
}
```

`use-stable-reference` really shines for library authors or for those writing reusable code. With a library-consumer relationship, the library author can't reasonably expect that the consumer will preemptively wrap any callbacks in a `useCallback`, or any referentially unstable values in a `useMemo`. This leaves the author with a few possible choices for how to handle consumer-provided non-primitive arguments:

1. Leave them out of any dependency arrays, and ignore any eslint React linter warnings/errors
2. Leave them in the dependency arrays, expecting that the effects / memoizations will run every render
3. Wrap them in a `useStableCallback`/`useStableValue`

With option 3, the returned callback/value-getter are referentially stable, can safely be used in dependency arrays, and are guaranteed to always be up-to-date if the underlying option ever changes! 🎉

## API

### `useStableCallback`

`useStableCallback` accepts one argument, a callback of type: `(...args: any[]) => any`

`useStableCallback` returns an up-to-date, referentially stable callback.

### `useStableValue`

`useStableValue` accepts one argument, a value of type: `unknown`

`useStableValue` returns a referentially stable callback that returns an up-to-date copy of the argument.

## FAQ

### Haven't I seen this before?

A version of this hook has been floating around the React community for a while, often referred to as `useEvent` or `useEffectCallback`. This package hopes to distill the best aspects of several different implementations:

- [`useEvent` RFC](https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md#internal-implementation), [legacy React docs](https://legacy.reactjs.org/docs/hooks-faq.html#how-to-read-an-often-changing-value-from-usecallback)
  - Basic implementation
- [`wouter`](https://github.com/molefrog/wouter/blob/v3/packages/wouter/src/react-deps.js)
  - Initializing the `useRef` to the callback argument, rather than `null`
- [`react-use-event-hook`](https://github.com/scottrippey/react-use-event-hook)
  - Support passing a callback argument that uses the `this` keyword
- [`react-use/useLatest`](https://github.com/streamich/react-use/blob/master/src/useLatest.ts)
  - Updating the `ref` in the render method
  - This method is [controversial](https://stackoverflow.com/questions/68025789/is-it-safe-to-change-a-refs-value-during-render-instead-of-in-useeffect), but I think the trade-offs are worth it; see below.

### Isn't updating a `ref` in the render method a bad practice?

Updating a `ref` in the render method is only dangerous when using concurrent features. Consider the following scenario:

1. A component re-renders, i.e. the render method runs
2. The `ref` is updated
3. The DOM updates are discarded because a second, higher-priority render was triggered
4. The higher-priority render occurs
5. Any code which uses the `ref` value before it's updated in step `6` is using a value from a render that was discarded!
6. The `ref` is updated to the intended value

Thankfully, this is rarely something we need to worry about, for a few reasons:

1. Concurrent mode is [opt-in](https://react.dev/blog/2022/03/29/react-v18#gradually-adopting-concurrent-features), triggered only when using concurrent features
2. Concurrent features are only available in React 18+
3. The React compiler, which will make this library unnecessary, is in beta starting with React 19
4. The callbacks and values that are passed to `useStableCallback` and `useStableValue` may be referentially unstable, but generally have the same behavior from render to render

In other words, for developers using React < 18, there's no issue because concurrent features aren't available; for devs using React > 19, you shouldn't need this package at all because of the React compiler; for those stuck in the middle using React 18, there's a good chance all the `ref` values will have the same behavior anyway, as long as you pass a callback/value with the same behavior every render.

That leaves just one scenario to consider. For devs using React 18, with concurrent features, with dynamic callbacks/values, consider yourselves warned: your refs may be out-of-sync with your render!

