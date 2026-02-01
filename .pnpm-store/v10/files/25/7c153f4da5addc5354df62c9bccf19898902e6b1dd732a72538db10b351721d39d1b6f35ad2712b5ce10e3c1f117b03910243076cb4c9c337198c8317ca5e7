import { EmojiPack } from "./emoji-pack";
import { ConfigOptions } from "./config-options";
export declare class Config {
    options: ConfigOptions;
    pack: EmojiPack;
    constructor(options?: ConfigOptions);
    _load(options: ConfigOptions): void;
    validate(options: ConfigOptions): void;
    /**
     * Looks for a root directory, containing the given pattern
     * @param pattern
     * @param cwd
     */
    static findRoot(pattern: string, cwd?: string): string | undefined;
    static load(configFile?: string, cwd?: string): Promise<Config>;
}
