import { Future } from '../../types/Future';
import { Consumer } from './Consumer';
declare class NaiveStore {
    lookupFuture: Future<Record<string, string>>;
}
export declare class ResetNaiveConsumer implements Consumer {
    naiveStore: NaiveStore;
    setValue(key: string, value: string): void;
    getValue(key: string): string;
}
export {};
