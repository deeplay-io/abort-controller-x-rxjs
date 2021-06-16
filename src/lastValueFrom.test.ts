import AbortController from 'node-abort-controller';
import {EMPTY, NEVER, of} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {lastValueFrom} from './lastValueFrom';

test('lastValueFrom', async () => {
  await expect(
    lastValueFrom(new AbortController().signal, of('test')),
  ).resolves.toMatchInlineSnapshot(`"test"`);

  await expect(
    lastValueFrom(new AbortController().signal, EMPTY),
  ).rejects.toMatchInlineSnapshot(`[EmptyError: no elements in sequence]`);

  await expect(
    lastValueFrom(new AbortController().signal, EMPTY, {defaultValue: 'test'}),
  ).resolves.toMatchInlineSnapshot(`"test"`);

  const abortController = new AbortController();
  let unsubscribed = false;
  let result: PromiseSettledResult<never> | undefined;

  lastValueFrom(
    abortController.signal,
    NEVER.pipe(
      finalize(() => {
        unsubscribed = true;
      }),
    ),
  ).then(
    value => {
      result = {status: 'fulfilled', value};
    },
    reason => {
      result = {status: 'rejected', reason};
    },
  );

  await new Promise(resolve => setTimeout(resolve, 100));

  expect(unsubscribed).toBe(false);
  expect(result).toBe(undefined);

  abortController.abort();

  await new Promise(resolve => setTimeout(resolve, 100));

  expect(unsubscribed).toBe(true);
  expect(result).toMatchInlineSnapshot(`
    Object {
      "reason": [AbortError: The operation has been aborted],
      "status": "rejected",
    }
  `);
});
