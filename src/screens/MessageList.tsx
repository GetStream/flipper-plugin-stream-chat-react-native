import React from "react";
import { Comment, Layout, List, Typography } from "antd";
import moment from "moment";
import { MessageType } from "../types";

export type MessageListScreenType = {
    messages: MessageType[];
    setSelectedMessageId: (id: string) => void;
};

const MessageListScreen = (props: MessageListScreenType) => {
    const { messages, setSelectedMessageId } = props;
    return (
        <Layout>
            <Typography
                style={{ fontSize: 30, paddingLeft: 20, textAlign: "center" }}
            >
                Message List
            </Typography>
            {messages && (
                <List
                    itemLayout="vertical"
                    dataSource={messages.map((item: MessageType) => {
                        return {
                            created_at: item.created_at,
                            html: item.html,
                            id: item.id,
                            userName: item.user.name,
                            text: item.text
                                ? item.text
                                : "This message has attachments. Click to open.",
                            userImage: item.user.image,
                        };
                    })}
                    renderItem={(item) => {
                        return (
                            <List.Item
                                onClick={() => {
                                    setSelectedMessageId(item.id);
                                }}
                            >
                                <Comment
                                    author={item.userName}
                                    avatar={item.userImage}
                                    content={item.text}
                                    datetime={moment(item.created_at).fromNow()}
                                />
                            </List.Item>
                        );
                    }}
                />
            )}
        </Layout>
    );
};

export default MessageListScreen;
