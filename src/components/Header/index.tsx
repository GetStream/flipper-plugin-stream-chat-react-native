import React from "react";
import { PageHeader, Row, Col, Typography, Switch } from "antd";
import { ClientType } from "../../types";

export type HeaderType = {
    viewClient: boolean;
    setViewClient: (checked: boolean) => void;
};

const Header = (props: HeaderType) => {
    const { viewClient, setViewClient } = props;
    return (
        <PageHeader style={{ backgroundColor: "darkgray" }}>
            <Row>
                <Col>
                    <Typography style={{ color: "white" }}>
                        View Authenticated Client
                    </Typography>
                </Col>
                <Col style={{ marginLeft: 20 }}>
                    <Switch
                        checked={viewClient}
                        onChange={(checked) => {
                            setViewClient(checked);
                        }}
                    />
                </Col>
            </Row>
        </PageHeader>
    );
};

export default Header;
