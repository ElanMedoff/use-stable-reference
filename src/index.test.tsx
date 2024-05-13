import React from "react";
import { render } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useStableCallback, useStableValue } from "./index";

describe("useStableCallback", () => {
  let withFlag: () => void;
  let withoutFlag: () => void;

  function Consumer({ flag }: { flag: boolean }) {
    const callback = flag ? () => withFlag() : () => withoutFlag();
    useLibrary({ callback, flag });
    return null;
  }

  function useLibrary({
    callback,
    flag,
  }: {
    callback: () => void;
    flag: boolean;
  }) {
    const stableCallback = useStableCallback(callback);

    React.useEffect(() => {
      stableCallback();
    }, [stableCallback, flag]);
  }

  beforeEach(() => {
    withFlag = jest.fn();
    withoutFlag = jest.fn();
  });

  it("should return a stable callback that is always up to date", () => {
    expect(withoutFlag).toHaveBeenCalledTimes(0);
    expect(withFlag).toHaveBeenCalledTimes(0);

    const { rerender } = render(<Consumer flag={false} />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(0);

    rerender(<Consumer flag={false} />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(0);

    rerender(<Consumer flag={false} />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(0);

    rerender(<Consumer flag />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(1);

    rerender(<Consumer flag />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(1);

    rerender(<Consumer flag />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(1);
  });

  it("should call the callback with the correct `this`", () => {
    interface Obj {
      spy: jest.Mock;
      callback?: (...args: any[]) => any;
    }
    const obj: Obj = {
      spy: jest.fn(),
    };
    const callback = function () {
      this.spy();
    };

    expect(obj.spy).toHaveBeenCalledTimes(0);
    const { result } = renderHook(() => useStableCallback(callback));
    obj.callback = result.current;
    obj.callback();
    expect(obj.spy).toHaveBeenCalledTimes(1);
  });
});

describe("useStableValue", () => {
  let withFlag: () => void;
  let withoutFlag: () => void;

  function Consumer({ flag }: { flag: boolean }) {
    const value = { flag };
    useLibrary({ value, flag });
    return null;
  }

  function useLibrary<T extends { flag: boolean }>({
    value,
    flag,
  }: {
    value: T;
    flag: boolean;
  }) {
    const getStableValue = useStableValue(value);

    React.useEffect(() => {
      getStableValue().flag ? withFlag() : withoutFlag();
    }, [flag, getStableValue]);
  }

  beforeEach(() => {
    withFlag = jest.fn();
    withoutFlag = jest.fn();
  });

  it("should return a stable value that is always up to date", () => {
    expect(withoutFlag).toHaveBeenCalledTimes(0);
    expect(withFlag).toHaveBeenCalledTimes(0);

    const { rerender } = render(<Consumer flag={false} />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(0);

    rerender(<Consumer flag={false} />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(0);

    rerender(<Consumer flag={false} />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(0);

    rerender(<Consumer flag />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(1);

    rerender(<Consumer flag />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(1);

    rerender(<Consumer flag />);
    expect(withoutFlag).toHaveBeenCalledTimes(1);
    expect(withFlag).toHaveBeenCalledTimes(1);
  });
});
