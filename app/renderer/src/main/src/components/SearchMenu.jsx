import React, { useContext, useEffect } from "react";
import { Menu, Input } from "antd";
import AppContext from "../AppContext";

export default (props) => {
  const { searchSelectId, setSearchSelectId, showMenus } = useContext(
    AppContext
  );

  const { setSearchText } = useContext(AppContext);

  useEffect(() => {
    if (searchSelectId) {
      let inTag = false;
      showMenus.some((menu) => {
        if (menu.key === searchSelectId) {
          inTag = true;
          return true;
        }
      });
      if (!inTag) {
        setSearchSelectId(null);
      }
    } else {
      if (showMenus.length) {
        setSearchSelectId(showMenus[0].key);
      }
    }
  }, [showMenus]);

  return (
    <>
      <Input.Search
        size="small"
        style={{ margin: "10px 0px" }}
        placeholder="请输入待搜索标题"
        onSearch={(value) => setSearchText(value)}
        enterButton
      />
      <Menu
        mode="inline"
        selectedKeys={[searchSelectId]}
        style={{ height: "100%", borderRight: 0 }}
        onClick={({ key }) => {
          setSearchSelectId(key);
        }}
      >
        {showMenus.length ? (
          <>
            {showMenus.map((menu) => (
              <Menu.Item
                key={menu.key}
                style={{ height: "24px", lineHeight: "24px" }}
              >
                {menu.value}
              </Menu.Item>
            ))}
          </>
        ) : (
          <div style={{ textAlign: "center",marginTop:"20px", color: "#999999" }}>
            无匹配卡片
          </div>
        )}
      </Menu>
    </>
  );
};
