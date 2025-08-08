import packageJson from '../../package.json' with { type: 'json' };
import { BaseRepo } from '../database/repo';


export class HealthService extends BaseRepo {
    getDbStatus(): boolean {
        return this.db.$client.open;
    }

    getVersion(): string {
        return packageJson.version;
    }
}
