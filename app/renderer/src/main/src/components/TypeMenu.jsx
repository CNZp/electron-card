import React, { useContext } from "react";
import { Menu } from "antd";
import AppContext from "../AppContext";

export default (props) => {
  const { selectType, setSelectType, typeMenus } = useContext(AppContext);

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectType]}
      style={{ height: "100%", borderRight: 0 }}
      onClick={({ key }) => {
        setSelectType(key);
      }}
    >
      {typeMenus.map((menu) => (
        <Menu.Item
          key={menu.key}
          style={{ height: "24px", lineHeight: "24px" }}
        >{`${menu.key} (${menu.total})`}</Menu.Item>
      ))}
    </Menu>
  );
};
