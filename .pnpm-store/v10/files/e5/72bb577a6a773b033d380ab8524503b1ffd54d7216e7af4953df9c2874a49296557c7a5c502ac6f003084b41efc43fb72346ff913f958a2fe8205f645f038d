export type SessionBuilder = ReturnType<typeof createSessionBuilder>;
export declare function createSessionBuilder<SessionTypes extends Record<string, any> = {}>(): {
    verify(token: string): Promise<{ [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    }>;
    create(session: { [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    }): Promise<string>;
    $type: SessionTypes;
    $typeValues: { [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    };
};
