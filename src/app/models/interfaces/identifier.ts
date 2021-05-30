import { IdType } from '../enum/id-type.enum';
import { Period } from '../interfaces/period';

export interface Identifier {
    use: IdType,
    type: string,
    value: string,
    period: Period,
    assigner: string
}
