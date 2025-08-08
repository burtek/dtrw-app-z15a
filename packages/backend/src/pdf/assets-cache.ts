import { promises } from 'node:fs';


export class AssetsCache<T extends string> {
    private cache: Partial<Record<T, Promise<Buffer>>> = {};

    constructor(private readonly config: Record<T, { path: string }>) {
    }

    async get(key: T) {
        // eslint-disable-next-line no-multi-assign
        const cache = this.cache[key] ??= promises.readFile(this.config[key].path);
        try {
            return await cache;
        } catch (err) {
            delete this.cache[key];
            throw err;
        }
    }
}
