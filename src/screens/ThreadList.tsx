import React from "react";
import { Comment, Layout, List, Typography } from "antd";
import moment from "moment";
import { MessageType } from "../types";

export type ThreadListScreenType = {
    threadMessages: MessageType[];
    setSelectedThreadMessageId: (id: string) => void;
};

const ThreadMessageListScreen = (props: ThreadListScreenType) => {
    const { threadMessages, setSelectedThreadMessageId } = props;
    return (
        <Layout>
            <Typography
                style={{ fontSize: 30, paddingLeft: 20, textAlign: "center" }}
            >
                Thread List
            </Typography>
            {threadMessages && (
                <List
                    itemLayout="vertical"
                    dataSource={threadMessages.map((item: MessageType) => {
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
                                    setSelectedThreadMessageId(item.id);
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

export default ThreadMessageListScreen;
