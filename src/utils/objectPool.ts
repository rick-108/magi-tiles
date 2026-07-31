export class ObjectPool<T> {
  private pool: T[] = [];
  private createFn: () => T;
  private resetFn: (obj: T) => void;

  constructor(createFn: () => T, resetFn: (obj: T) => void, initialSize = 0) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    for (let i = 0; i < initialSize; i++) this.pool.push(this.createFn());
  }

  acquire(): T {
    return this.pool.pop() ?? this.createFn();
  }

  release(obj: T) {
    try {
      this.resetFn(obj);
      this.pool.push(obj);
    } catch (e) {
      // swallow reset errors to avoid breaking the game loop
    }
  }

  size(): number {
    return this.pool.length;
  }
}
