import React from "react";
import {
    PluginClient,
    usePlugin,
    createState,
    useValue,
    Layout,
    DetailSidebar,
    DataInspector,
} from "flipper-plugin";
import { Typography } from "antd";
import Header from "./components/Header";
import ChannelListScreen from "./screens/ChannelList";
import MessageListScreen from "./screens/MessageList";
import ThreadMessageListScreen from "./screens/ThreadList";
import {
    Events,
    MessageType,
    Methods,
    ChannelType,
    RowType,
    ThreadType,
} from "./types";

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Methods>) {
    const channels = createState<ChannelType[]>([], { persist: "channels" });
    const messages = createState<MessageType[]>([], { persist: "messages" });
    const threadList = createState<ThreadType[]>([], { persist: "threadList" });
    const selectedChannelId = createState<string | null>(null, {
        persist: "selectedChannelId",
    });
    const selectedMessageId = createState<string | null>(null, {
        persist: "selectedMessageId",
    });
    const selectedThreadMessageId = createState<string | null>(null, {
        persist: "selectedThreadMessageId",
    });
    const eventType = createState<string | null>(null, {
        persist: "eventType",
    });

    const darkMode = createState<boolean>(false, { persist: "darkMode" });

    client.onMessage("Channels", (newData) => {
        channels.set(newData);
        eventType.set("Channels");
    });

    client.onMessage("Messages", (newData) => {
        messages.set(newData);
        eventType.set("Messages");
    });

    client.onMessage("ThreadList", (newData) => {
        threadList.set(newData);
        eventType.set("ThreadList");
    });

    const setSelectedChannelId = (id: string) => {
        selectedChannelId.set(id);
    };

    const setSelectedMessageId = (id: string) => {
        selectedMessageId.set(id);
    };

    const setSelectedThreadMessageId = (id: string) => {
        selectedThreadMessageId.set(id);
    };

    const setDarkMode = (checked: boolean) => {
        darkMode.set(checked);
        client.send("darkMode", {
            darkMode,
        });
    };

    return {
        channels,
        darkMode,
        eventType,
        messages,
        threadList,
        selectedChannelId,
        selectedMessageId,
        selectedThreadMessageId,
        setSelectedChannelId,
        setSelectedMessageId,
        setSelectedThreadMessageId,
        setDarkMode,
    };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
    const instance = usePlugin(plugin);
    const channels = useValue(instance.channels);
    const messages = useValue(instance.messages);
    const threadMessages = useValue(instance.threadList);
    const selectedChannelId = useValue(instance.selectedChannelId);
    const selectedMessageId = useValue(instance.selectedMessageId);
    const selectedThreadMessageId = useValue(instance.selectedThreadMessageId);
    const eventType = useValue(instance.eventType);
    const darkMode = useValue(instance.darkMode);

    return (
        <Layout.ScrollContainer>
            <Header
                darkMode={darkMode}
                setDarkMode={(data: boolean) => {
                    instance.setDarkMode(data);
                }}
            />
            {eventType === "Channels" && (
                <ChannelListScreen
                    channels={channels}
                    setSelectedChannelId={(id) => {
                        instance.setSelectedChannelId(id);
                    }}
                />
            )}
            {eventType === "Messages" && (
                <MessageListScreen
                    messages={messages}
                    setSelectedMessageId={(id) => {
                        instance.setSelectedMessageId(id);
                    }}
                />
            )}
            {eventType === "ThreadList" && (
                <ThreadMessageListScreen
                    threadMessages={threadMessages}
                    setSelectedThreadMessageId={(id) => {
                        instance.setSelectedThreadMessageId(id);
                    }}
                />
            )}
            <DetailSidebar>
                {selectedChannelId &&
                    renderSidebar(
                        channels.find(
                            (channel) => channel.data.id === selectedChannelId
                        )
                    )}
                {selectedMessageId &&
                    renderSidebar(
                        messages.find(
                            (message) => message.id === selectedMessageId
                        )
                    )}
                {selectedThreadMessageId &&
                    renderSidebar(
                        threadMessages.find(
                            (threadMessage) =>
                                threadMessage.id === selectedThreadMessageId
                        )
                    )}
            </DetailSidebar>
        </Layout.ScrollContainer>
    );
}

function renderSidebar(row: RowType) {
    return (
        <Layout.Container gap pad>
            <Typography.Title level={4}>{row.name}</Typography.Title>
            <DataInspector data={row} />
        </Layout.Container>
    );
}
