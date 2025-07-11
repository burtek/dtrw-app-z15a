/* eslint-disable @typescript-eslint/member-ordering, @typescript-eslint/naming-convention */

import { plainToInstance } from 'class-transformer';
import { IsEnum, IsString, MinLength, validateSync } from 'class-validator';


enum Environment {
    Development = 'development',
    Production = 'production'
}

class EnvironmentVariables {
    @IsEnum(Environment)
    NODE_ENV: Environment;

    @IsString()
    @MinLength(1)
    DB_FILE_NAME: string;
}

export function validate(config: Record<string, unknown>) {
    const validatedConfig = plainToInstance(
        EnvironmentVariables,
        config,
        { enableImplicitConversion: true }
    );
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });

    if (errors.length > 0) {
        throw new Error(errors.toString());
    }
    return validatedConfig;
}
