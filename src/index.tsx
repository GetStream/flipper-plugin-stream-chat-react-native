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
import { Empty, Typography } from "antd";
import Header from "./components/Header";
import ChannelListScreen from "./screens/ChannelList";
import MessageListScreen from "./screens/MessageList";
import ThreadMessageListScreen from "./screens/ThreadList";
import {
    Events,
    MessageType,
    Methods,
    ChannelType,
    ClientType,
    RowType,
    ThreadType,
} from "./types";

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Methods>) {
    const channels = createState<ChannelType[]>([], { persist: "channels" });
    const authenticatedClient = createState<ClientType | null>(null, {
        persist: "client",
    });
    const messages = createState<MessageType[]>([], { persist: "messages" });
    const threadList = createState<ThreadType[]>([], { persist: "threadList" });
    const selectedChannel = createState<ChannelType | null>(null, {
        persist: "selectedChannel",
    });
    const selectedMessage = createState<MessageType | null>(null, {
        persist: "selectedMessage",
    });
    const selectedThreadMessage = createState<MessageType | null>(null, {
        persist: "selectedThreadMessage",
    });
    const eventType = createState<string | null>(null, {
        persist: "eventType",
    });
    const viewClient = createState<boolean>(false, {
        persist: "viewClient",
    });

    client.onMessage("Channels", (newData) => {
        channels.set(newData);
        eventType.set("Channels");
    });

    client.onMessage("Client", (newData) => {
        authenticatedClient.set(newData);
        eventType.set("Client");
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
        const data = [...channels.get()];
        const channelWithId = data.find((channel) => channel.data.id === id);
        if (channelWithId) selectedChannel.set(channelWithId);
        selectedMessage.set(null);
        selectedThreadMessage.set(null);
        viewClient.set(false);
    };

    const setSelectedMessageId = (id: string) => {
        const data = [...messages.get()];
        const messageWithId = data.find((message) => message.id === id);
        if (messageWithId) selectedMessage.set(messageWithId);
        selectedChannel.set(null);
        selectedThreadMessage.set(null);
        viewClient.set(false);
    };

    const setSelectedThreadMessageId = (id: string) => {
        const data = [...threadList.get()];
        const threadMessageWithId = data.find(
            (threadMessage) => threadMessage.id === id
        );
        if (threadMessageWithId) selectedThreadMessage.set(threadMessageWithId);
        selectedChannel.set(null);
        selectedMessage.set(null);
        viewClient.set(false);
    };

    const setViewClient = (checked: boolean) => {
        viewClient.set(checked);
        selectedThreadMessage.set(null);
        selectedChannel.set(null);
        selectedMessage.set(null);
    };

    return {
        authenticatedClient,
        channels,
        eventType,
        messages,
        threadList,
        viewClient,
        selectedChannel,
        selectedMessage,
        selectedThreadMessage,
        setSelectedChannelId,
        setSelectedMessageId,
        setSelectedThreadMessageId,
        setViewClient,
    };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
    const instance = usePlugin(plugin);
    const channels = useValue(instance.channels);
    const authenticatedClient = useValue(instance.authenticatedClient);
    const viewClient = useValue(instance.viewClient);
    const messages = useValue(instance.messages);
    const threadMessages = useValue(instance.threadList);
    const selectedChannel = useValue(instance.selectedChannel);
    const selectedMessage = useValue(instance.selectedMessage);
    const selectedThreadMessage = useValue(instance.selectedThreadMessage);
    const eventType = useValue(instance.eventType);

    return (
        <Layout.ScrollContainer>
            <Header
                viewClient={viewClient}
                setViewClient={(checked: boolean) => {
                    instance.setViewClient(checked);
                }}
            />
            {!eventType && (
                <Empty
                    style={{ marginTop: 20 }}
                    description="If you don't see any data, please refresh the app."
                />
            )}

            {eventType === "Channels" && (
                <ChannelListScreen
                    channels={channels}
                    setSelectedChannelId={(id) =>
                        instance.setSelectedChannelId(id)
                    }
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
                {viewClient &&
                    authenticatedClient &&
                    renderSidebar(
                        authenticatedClient,
                        authenticatedClient.name
                    )}
                {selectedChannel &&
                    renderSidebar(selectedChannel, selectedChannel.data.id)}
                {selectedMessage &&
                    renderSidebar(selectedMessage, selectedMessage.id)}
                {selectedThreadMessage &&
                    renderSidebar(
                        selectedThreadMessage,
                        selectedThreadMessage.id
                    )}
            </DetailSidebar>
        </Layout.ScrollContainer>
    );
}

function renderSidebar(row: RowType, heading: string) {
    return (
        <Layout.Container gap pad>
            <Typography.Title level={4}>{heading}</Typography.Title>
            <DataInspector data={row} />
        </Layout.Container>
    );
}
