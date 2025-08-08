import { getDb } from '.';


export abstract class BaseRepo {
    protected get db() {
        return getDb();
    }
}
