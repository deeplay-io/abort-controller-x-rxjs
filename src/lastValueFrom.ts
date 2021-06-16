import {execute} from 'abort-controller-x';
import {AbortSignal} from 'node-abort-controller';
import {EmptyError, Observable} from 'rxjs';

export interface LastValueFromConfig<T> {
  defaultValue: T;
}

export function lastValueFrom<T, D>(
  signal: AbortSignal,
  source: Observable<T>,
  config: LastValueFromConfig<D>,
): Promise<T | D>;
export function lastValueFrom<T>(
  signal: AbortSignal,
  source: Observable<T>,
): Promise<T>;

/**
 * Like original `lastValueFrom` from RxJS, but accepts `AbortSignal`. When that
 * signal is aborted, unsubscribes from the observable and throws `AbortError`.
 */
export function lastValueFrom<T, D>(
  signal: AbortSignal,
  source: Observable<T>,
  config?: LastValueFromConfig<D>,
): Promise<T | D> {
  const hasConfig = typeof config === 'object';
  return execute<T | D>(signal, (resolve, reject) => {
    let _hasValue = false;
    let _value: T;

    const subscription = source.subscribe({
      next: value => {
        _value = value;
        _hasValue = true;
      },
      error: reject,
      complete: () => {
        if (_hasValue) {
          resolve(_value);
        } else if (hasConfig) {
          resolve(config!.defaultValue);
        } else {
          reject(new EmptyError());
        }
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  });
}
