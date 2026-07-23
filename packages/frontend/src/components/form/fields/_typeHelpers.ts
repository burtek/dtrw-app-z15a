import type { Control, Path, PathValue, Validate } from 'react-hook-form';


export interface ControlProps<Values extends Record<string, unknown>> {
    control: Control<Values>;
    name: Path<Values>;
}

export interface WithValidateRule<Values extends Record<string, unknown>> {
    validate?: Validate<PathValue<Values, Path<Values>>, Values> | Record<string, Validate<PathValue<Values, Path<Values>>, Values>>;
}
