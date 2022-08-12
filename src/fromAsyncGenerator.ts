import {Observable} from 'rxjs';

/**
 * Turns abortable async generator to observable.
 */
export function fromAsyncGenerator<T>(
  fn: (signal: AbortSignal) => AsyncIterable<T>,
): Observable<T> {
  return new Observable<T>(subscriber => {
    const abortController = new AbortController();

    async function iterate() {
      for await (const item of fn(abortController.signal)) {
        if (subscriber.closed) {
          return;
        }

        subscriber.next(item);
      }
    }

    iterate().then(
      () => subscriber.complete(),
      err => subscriber.error(err),
    );

    return () => {
      abortController.abort();
    };
  });
}
