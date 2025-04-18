function memoize<T extends (...args: any[]) => any>(fn: T): T {
    const cache = new Map<string, ReturnType<T>>();

    return function (...args: Parameters<T>): ReturnType<T> {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    } as T;
}

export { memoize };
