# abort-controller-x-rxjs [![npm version][npm-image]][npm-url]

Abortable helpers for RxJS.

This is a companion package of
[`abort-controller-x`](https://github.com/deeplay-io/abort-controller-x).

- [Installation](#installation)
- [API](#api)
  - [`defer`](#defer)
  - [`firstValueFrom`](#firstvaluefrom)
  - [`lastValueFrom`](#lastvaluefrom)
  - [`fromAsyncGenerator`](#fromasyncgenerator)

## Installation

```
yarn add abort-controller-x-rxjs
```

## API

### `defer`

```ts
function defer<R extends ObservableInput<any> | void>(
  observableFactory: (signal: AbortSignal) => R,
): Observable<ObservedValueOf<R>>;
```

Like original [`defer`](https://rxjs.dev/api/index/function/defer) from RxJS,
but aborts passed function when unsubscribed.

### `firstValueFrom`

```ts
function firstValueFrom<T, D>(
  signal: AbortSignal,
  source: Observable<T>,
  config: FirstValueFromConfig<D>,
): Promise<T | D>;
function firstValueFrom<T>(
  signal: AbortSignal,
  source: Observable<T>,
): Promise<T>;

interface FirstValueFromConfig<T> {
  defaultValue: T;
}
```

Like original
[`firstValueFrom`](https://rxjs.dev/api/index/function/firstValueFrom) from
RxJS, but accepts `AbortSignal`. When that signal is aborted, unsubscribes from
the observable and throws `AbortError`.

### `lastValueFrom`

```ts
function lastValueFrom<T, D>(
  signal: AbortSignal,
  source: Observable<T>,
  config: LastValueFromConfig<D>,
): Promise<T | D>;
function lastValueFrom<T>(
  signal: AbortSignal,
  source: Observable<T>,
): Promise<T>;

interface LastValueFromConfig<T> {
  defaultValue: T;
}
```

Like original
[`lastValueFrom`](https://rxjs.dev/api/index/function/lastValueFrom) from RxJS,
but accepts `AbortSignal`. When that signal is aborted, unsubscribes from the
observable and throws `AbortError`.

### `fromAsyncGenerator`

```ts
function fromAsyncGenerator<T>(
  fn: (signal: AbortSignal) => AsyncIterable<T>,
): Observable<T>;
```

Turns abortable async generator to observable.

[npm-image]: https://badge.fury.io/js/abort-controller-x-rxjs.svg
[npm-url]: https://badge.fury.io/js/abort-controller-x-rxjs
