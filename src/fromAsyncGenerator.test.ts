import {delay} from 'abort-controller-x';
import {lastValueFrom} from 'rxjs';
import {take, toArray} from 'rxjs/operators';
import {fromAsyncGenerator} from './fromAsyncGenerator';

test('fromAsyncGenerator', async () => {
  await expect(
    lastValueFrom(
      fromAsyncGenerator(async function* (signal) {
        yield 1;
        await delay(signal, 10);
        yield 2;
        await delay(signal, 20);
        yield 3;
      }).pipe(toArray()),
    ),
  ).resolves.toMatchInlineSnapshot(`
              Array [
                1,
                2,
                3,
              ]
          `);

  let _signal: AbortSignal | undefined;

  const observable = fromAsyncGenerator(async function* (signal) {
    _signal = signal;

    for (let i = 1; ; i++) {
      yield i;
      await delay(signal, 100);
    }
  });

  await expect(lastValueFrom(observable.pipe(take(3), toArray()))).resolves
    .toMatchInlineSnapshot(`
          Array [
            1,
            2,
            3,
          ]
        `);
  expect(_signal?.aborted).toBe(true);
});
