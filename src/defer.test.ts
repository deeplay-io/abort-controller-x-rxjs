import {forever} from 'abort-controller-x';
import {AbortSignal} from 'node-abort-controller';
import {lastValueFrom, ObservableNotification} from 'rxjs';
import {materialize, tap} from 'rxjs/operators';
import {defer} from './defer';

test('defer', async () => {
  await expect(
    lastValueFrom(defer(async () => 'test')),
  ).resolves.toMatchInlineSnapshot(`"test"`);

  await expect(
    lastValueFrom(
      defer(() => {
        throw new Error('test');
      }),
    ),
  ).rejects.toMatchInlineSnapshot(`[Error: test]`);

  let _signal: AbortSignal | undefined;

  const observable = defer(signal => {
    _signal = signal;

    return forever(signal);
  });

  expect(_signal).toBe(undefined);

  const notifications: ObservableNotification<any>[] = [];

  const subscription = observable
    .pipe(
      materialize(),
      tap(notification => {
        notifications.push(notification);
      }),
    )
    .subscribe();

  await new Promise(resolve => setTimeout(resolve, 100));

  expect(notifications.length).toBe(0);

  subscription.unsubscribe();

  expect(_signal?.aborted).toBe(true);
});
