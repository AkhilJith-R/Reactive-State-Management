"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStore = createStore;
class NewStore {
    constructor(initial) {
        this.listeners = new Set();
        this.calculatedValues = new Map();
        this.state = initial;
    }
    getState() {
        return this.state;
    }
    setState(partial) {
        this.state = Object.assign(Object.assign({}, this.state), partial);
        this.updates();
        this.recompute();
    }
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.state);
        return () => {
            this.listeners.delete(listener);
        };
    }
    compute(key, deps, compute) {
        this.calculatedValues.set(key, { deps, compute });
        this.recompute();
        return this;
    }
    updates() {
        for (const listener of this.listeners) {
            listener(this.state);
        }
    }
    recompute() {
        for (const [key, { deps, compute }] of this.calculatedValues) {
            const calculatedValue = compute(this.state);
            this.state = Object.assign(Object.assign({}, this.state), { [key]: calculatedValue });
        }
        this.updates();
    }
}
function createStore(initial) {
    return new NewStore(initial);
}
