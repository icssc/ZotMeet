/// <reference types="node" />
import { Writable, WritableOptions } from "stream";
import { StringDecoder } from "string_decoder";
declare class StringWritable extends Writable {
    data: string;
    decoder: StringDecoder;
    constructor(options?: WritableOptions);
    _write(chunk: any, encoding: string, callback: () => void): void;
    _destroy(err: Error, callback: () => void): void;
}
export declare class MockCli {
    mocks: [Writable, Writable, Writable["write"]][];
    stdout?: StringWritable;
    stderr?: StringWritable;
    console: Console;
    mock(stream: Writable): StringWritable;
    restore(): void;
    setup(): void;
    test(func: () => void): void;
    testAsync<T>(func: () => Promise<T>): Promise<void>;
}
export {};
