import {EMPTY, from, Observable, ObservableInput, ObservedValueOf} from 'rxjs';

/**
 * Like original `defer` from RxJS, but aborts passed function when
 * unsubscribed.
 */
export function defer<R extends ObservableInput<any> | void>(
  observableFactory: (signal: AbortSignal) => R,
): Observable<ObservedValueOf<R>> {
  return new Observable<ObservedValueOf<R>>(subscriber => {
    const abortController = new AbortController();

    let input: R | void;

    try {
      input = observableFactory(abortController.signal);
    } catch (err) {
      subscriber.error(err);

      return () => {
        abortController.abort();
      };
    }

    const source = input
      ? from(input as ObservableInput<ObservedValueOf<R>>)
      : EMPTY;

    return source.subscribe(subscriber).add(() => {
      abortController.abort();
    });
  });
}
