import { Avatar, Layout, List, Typography } from "antd";
import React from "react";
import { ChannelType } from "../types";

export type ChannelListScreenType = {
    channels: ChannelType[];
    setSelectedChannelId: (id: string) => void;
};

const ChannelListScreen = (props: ChannelListScreenType) => {
    const { channels, setSelectedChannelId } = props;
    return (
        <Layout>
            <Typography
                style={{ fontSize: 30, paddingLeft: 20, textAlign: "center" }}
            >
                Channel List
            </Typography>
            <List
                itemLayout="vertical"
                dataSource={channels.map((item: ChannelType) => {
                    return {
                        image: item.data.image,
                        title: item.data.name
                            ? item.data.name
                            : Object.values(item.members)
                                  .map((user) => user.user.name)
                                  .join(", ")
                                  .slice(0, 40) + "...",
                        id: item.data.id,
                    };
                })}
                renderItem={(item) => {
                    return (
                        <List.Item
                            onClick={() => {
                                setSelectedChannelId(item.id);
                            }}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        src={item.image}
                                        style={{ margin: 10 }}
                                    />
                                }
                                title={item.title}
                                description={item.id}
                            />
                        </List.Item>
                    );
                }}
            />
        </Layout>
    );
};

export default ChannelListScreen;
