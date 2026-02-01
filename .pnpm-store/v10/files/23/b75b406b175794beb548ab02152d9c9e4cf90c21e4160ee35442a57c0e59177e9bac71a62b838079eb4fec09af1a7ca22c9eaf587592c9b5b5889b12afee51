export declare type TEmoji = {
    code: string;
    emoji: string;
    description?: string;
};
export declare class EmojiPack {
    codes: Map<string, TEmoji>;
    emojis: Map<string, TEmoji[]>;
    emojiVariation: string;
    add(def: TEmoji): void;
    wrap(code: string): string;
    unwrap(code: string): string;
    getCodes(emoji: string): TEmoji[] | undefined;
    getCode(emoji: string): string | undefined;
    get(code: string): TEmoji | undefined;
}
export declare const github: EmojiPack;
export declare const gitmoji: EmojiPack;
