import React, { useContext } from "react";
import { Menu } from "antd";
import AppContext from "../AppContext";

export default (props) => {
  const { selectTag, setSelectTag, showMenus } = useContext(AppContext);

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectTag]}
      style={{ height: "100%", borderRight: 0 }}
      onClick={({ key }) => {
        setSelectTag(key);
      }}
    >
      <div style={{ textAlign: "center", marginTop: "20px",marginBottom: "20px", color: "#999999" }}>
        使用上、下键以快速切换
      </div>
      {showMenus.map((menu) => (
        <Menu.Item
          key={menu.key}
          style={{ height: "24px", lineHeight: "24px" }}
        >{`${menu.key} (${menu.total})`}</Menu.Item>
      ))}
    </Menu>
  );
};
