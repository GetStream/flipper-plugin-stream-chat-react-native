import React from "react";
import { PageHeader, Row, Col, Typography, Switch } from "antd";

export type HeaderType = {
    darkMode: boolean;
    setDarkMode: (data: boolean) => void;
};

const Header = (props: HeaderType) => {
    const { darkMode, setDarkMode } = props;
    return (
        <PageHeader style={{ backgroundColor: "darkgray" }}>
            <Row>
                <Col>
                    <Typography style={{ color: "white" }}>
                        Dark Mode
                    </Typography>
                </Col>
                <Col style={{ marginLeft: 20 }}>
                    <Switch
                        checked={darkMode}
                        onChange={(checked) => {
                            setDarkMode(checked);
                        }}
                    />
                </Col>
            </Row>
        </PageHeader>
    );
};

export default Header;
