import {AbortSignal} from 'node-abort-controller';
import {Observable} from 'rxjs';
import {first} from 'rxjs/operators';
import {lastValueFrom} from './lastValueFrom';

export interface FirstValueFromConfig<T> {
  defaultValue: T;
}

export function firstValueFrom<T, D>(
  signal: AbortSignal,
  source: Observable<T>,
  config: FirstValueFromConfig<D>,
): Promise<T | D>;
export function firstValueFrom<T>(
  signal: AbortSignal,
  source: Observable<T>,
): Promise<T>;

/**
 * Like original `firstValueFrom` from RxJS, but accepts `AbortSignal`. When
 * that signal is aborted, unsubscribes from the observable and throws
 * `AbortError`.
 */
export function firstValueFrom<T, D>(
  signal: AbortSignal,
  source: Observable<T>,
  config?: FirstValueFromConfig<D>,
): Promise<T | D> {
  return typeof config === 'object'
    ? lastValueFrom(signal, source.pipe(first()), config)
    : lastValueFrom(signal, source.pipe(first()));
}
