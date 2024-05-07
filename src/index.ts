import React from "react";

/**
 * @param `val` The value to be "stabilized".
 * @returns A referentially stable callback that can be used to access the latest version of the value.
 */
function useStableValue<Val>(val: Val) {
  const valRef = React.useRef(val);
  valRef.current = val;
  return React.useCallback(() => valRef.current, []);
}

/**
 * @param `cb` The callback to be "stabilized".
 * @returns An up-to-date referentially stable callback.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useStableCallback<Cb extends (...args: any[]) => any>(cb: Cb): Cb {
  const cbRef = React.useRef(cb);
  cbRef.current = cb;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    ((...args) => cbRef.current(...args)) as Cb,
    [],
  );
}

export { useStableValue, useStableCallback };
