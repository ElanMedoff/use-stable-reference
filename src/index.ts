import React from "react";

function useStableValue<Val>(val: Val) {
  const valRef = React.useRef(val);
  valRef.current = val;
  return React.useCallback(() => valRef.current, []);
}

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
