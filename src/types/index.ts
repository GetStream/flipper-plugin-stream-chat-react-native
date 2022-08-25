import { Atom } from "flipper-plugin";

export type ChannelType = {
    data: {
        name: string;
        image: string;
        id: string;
    };
    members: Record<
        string,
        {
            user: {
                name: string;
            };
        }
    >;
};

export type ClientType = {
    name: string;
};

export type MessageType = {
    created_at: string;
    html: string;
    id: string;
    text: string;
    user: { name: string; image: string };
};

export type ThreadType = MessageType;

export type Events = {
    Channels: ChannelType[];
    Client: ClientType;
    Messages: MessageType[];
    ThreadList: ThreadType[];
};

export type Methods = {
    darkMode(params: { darkMode: Atom<boolean> }): Promise<boolean[]>;
};

export type RowType = any;
