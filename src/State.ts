interface Store<T extends object> {
    getState(): T;
    setState(partial: Partial<T>): void;
    subscribe(listener: (state: T) => void): () => void;
    compute<K extends string, V>(
      key: K,
      deps: (keyof T)[],
      compute: (state: T) => V
    ): Store<T & Record<K, V>>;
  }
  
  class NewStore<T extends object> implements Store<T> {
    private state: T;
    private listeners: Set<(state: T) => void> = new Set();
    private calculatedValues: Map<string, { deps: (keyof T)[], compute: (state: T) => any }> = new Map();
  
    constructor(initial: T) {
      this.state = initial;
    }
  
    getState(): T {
      return this.state;
    }
  
    setState(partial: Partial<T>): void {
      this.state = { ...this.state, ...partial };
      this.updates();
      this.recompute();
    }
  
    subscribe(listener: (state: T) => void): () => void {
      this.listeners.add(listener);
      listener(this.state);
      return () => {
        this.listeners.delete(listener);
      };
    }
  
    compute<K extends string, V>(
      key: K,
      deps: (keyof T)[],
      compute: (state: T) => V
    ): Store<T & Record<K, V>> {
      this.calculatedValues.set(key, { deps, compute });
      this.recompute();
      return this as Store<T & Record<K, V>>;
    }
  
    private updates(): void {
      for (const listener of this.listeners) {
        listener(this.state);
      }
    }
  
    private recompute(): void {
      for (const [key, { deps, compute }] of this.calculatedValues) {
        const calculatedValue = compute(this.state);
        this.state = { ...this.state, [key]: calculatedValue };
      }
      this.updates();
    }
  }
  
  export function createStore<T extends object>(initial: T): Store<T> {
    return new NewStore(initial);
  }
  
