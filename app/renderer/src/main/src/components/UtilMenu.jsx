import React, { useContext } from "react";
import { Row, Col, Avatar } from "antd";
import AppContext from "../AppContext";
import { WechatOutlined, ZhihuOutlined } from "@ant-design/icons";

const UtilItem = (props) => {
  const { color, url, name, openWebview } = props;

  return (
    <div
      className="utilItem"
      onClick={() => {
        if (url) {
          let target = url;
          if (url.substring(0, 4) !== "http") {
            target = "http://" + target;
          }
          openWebview({name, url: target});
          // let targetName = name + (Math.random()*1000000).toFixed(0);
          // window.open(target, targetName, 'height=800, width=1300');
        }
      }}
    >
      <Avatar
        size={64}
        style={{ margin: "0 auto", backgroundColor: color || "#1890ff" }}
      >
        {name}
      </Avatar>
    </div>
  );
};

export default () => {
  const { utils, openWebview } = useContext(AppContext);

  return (
    <div style={{ height: "100%", padding: "10px" }}>
      <Row>
        {utils.length ? (
          <>
            {utils.map((util) => (
              <Col span={12}>
                <UtilItem {...util} openWebview={openWebview}/>
              </Col>
            ))}
          </>
        ) : (
          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              width: "100%",
              color: "#999999",
            }}
          >
            暂无可用工具
          </div>
        )}
      </Row>
    </div>
  );
};
