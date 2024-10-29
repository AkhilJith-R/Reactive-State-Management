import { createStore } from './State';

interface AppState {
  count: number;
  multiplier: number;
}

const store = createStore<AppState>({ count: 3, multiplier: 2 });

const enhancedStore = store.compute(
  'doubledCount',
  ['count', 'multiplier'],
  (state) => state.count * state.multiplier
);

enhancedStore.subscribe((state) => {
  console.log(state.doubledCount);
});

enhancedStore.setState({ count: 7 });

