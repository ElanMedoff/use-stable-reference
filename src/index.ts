import React from "react";

const useInsertionEffect = React.useInsertionEffect ?? React.useLayoutEffect;

function useStableMemo<Val>(val: Val) {
  const valRef = React.useRef(val);
  useInsertionEffect(() => {
    valRef.current = val;
  }, [val]);
  return React.useMemo(() => valRef.current, []);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useStableCallback<Cb extends (...args: any[]) => any>(cb: Cb): Cb {
  const cbRef = React.useRef(cb);
  useInsertionEffect(() => {
    cbRef.current = cb;
  }, [cb]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument
    ((...args) => cbRef.current(...args)) as Cb,
    [],
  );
}

export { useStableMemo, useStableCallback };
