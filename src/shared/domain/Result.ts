export class Result<T, E = unknown> {
  private constructor(
    private readonly _isOk: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  public static ok<T, E = never>(value?: T): Result<T, E> {
    return new Result<T, E>(true, value as T, undefined);
  }

  public static err<T = never, E = unknown>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  public isOk(): boolean {
    return this._isOk;
  }

  public isErr(): boolean {
    return !this._isOk;
  }

  public unwrap(): T {
    if (!this._isOk) {
      if (this._error instanceof Error) {
        throw this._error;
      }
      throw new Error(typeof this._error === "string" ? this._error : JSON.stringify(this._error));
    }
    return this._value as T;
  }

  public unwrapOr(fallback: T): T {
    if (!this._isOk) {
      return fallback;
    }
    return this._value as T;
  }

  public getError(): E | undefined {
    return this._error;
  }

  public map<U>(fn: (val: T) => U): Result<U, E> {
    if (!this._isOk) {
      return Result.err<U, E>(this._error as E);
    }
    return Result.ok<U, E>(fn(this._value as T));
  }

  public mapErr<F>(fn: (err: E) => F): Result<T, F> {
    if (this._isOk) {
      return Result.ok<T, F>(this._value as T);
    }
    return Result.err<T, F>(fn(this._error as E));
  }
}
