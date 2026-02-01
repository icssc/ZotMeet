import commander from "commander";
import { ConventionalCommits } from "./conventional-commits";
import { Devmoji } from "./devmoji";
export declare class Cli {
    program: commander.Command;
    devmoji: Devmoji;
    commits: ConventionalCommits;
    opts: {
        [key: string]: string | boolean | undefined;
    };
    constructor(program: commander.Command, devmoji: Devmoji);
    lint(text: string): string[];
    format(text: string, format?: string, processCommit?: boolean, processLog?: boolean, color?: string | boolean | undefined): string;
    list(): void;
    error(msg: string): void;
    gitRoot(cwd?: string): string | undefined;
    static create(argv?: string[], exitOverride?: boolean): Promise<Cli>;
    run(): void;
}
export declare function run(argv?: string[]): Promise<void>;
