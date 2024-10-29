"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = require("./State");
const store = (0, State_1.createStore)({ count: 3, multiplier: 2 });
const enhancedStore = store.compute('doubledCount', ['count', 'multiplier'], (state) => state.count * state.multiplier);
enhancedStore.subscribe((state) => {
    console.log(state.doubledCount);
});
enhancedStore.setState({ count: 7 });
