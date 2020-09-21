import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

// import { ipcRenderer } from "electron";
//const {ipcRenderer} = window.require('electron');

import { Button, Layout } from "antd";
import TypeMenu from "./components/TypeMenu";
import { UnorderedListOutlined } from "@ant-design/icons";
import TypeCard from "./components/TypeCard";
import AddCard from "./components/AddCard";
import AppContext from "./AppContext";
import lsApi from "./localStorageUtil";
import uuid from "uuidjs";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState({ types: [], typeToCards: {} });
  const [selectType, setSelectType] = useState("全部");

  useEffect(() => {
    let result = lsApi.get("cardData");
    if (result) {
      setData(result);
    }
  }, []);

  const addCard = (card) => {
    let newData = { ...data };
    let type = card.type;
    card.id = uuid.genV1().toString();
    if (newData.types.indexOf(type) === -1) {
      newData.types.push(type);
      newData.typeToCards[type] = [];
    }
    let newCards = newData.typeToCards[type];
    newCards.push({ ...card });
    lsApi.set("cardData", newData);
    setData(newData);
  };

  const removeCard = (card) => {
    let newData = { ...data };
    let type = card.type;
    let newCards = newData.typeToCards[type];
    if (newCards) {
      let removeCardIndex = -1;
      newCards.some((item, index) => {
        if (item.id === card.id) {
          removeCardIndex = index;
          return true;
        }
      });
      if (removeCardIndex > -1) {
        newCards.splice(removeCardIndex, 1);
        if (newCards.length === 0) {
          delete newData.typeToCards[type];
          let removeTypeIndex = newData.types.indexOf(type);
          if (removeTypeIndex > -1) {
            newData.types.splice(removeTypeIndex, 1);
          }
        }
      }
    }
    lsApi.set("cardData", newData);
    setData(newData);
  };

  let typeCards = useMemo(() => {
    let cards = [];
    let { types, typeToCards } = data;
    if (selectType === "全部") {
      types.map((type) => {
        cards = cards.concat(typeToCards[type] || []);
      });
    } else {
      cards = cards.concat(typeToCards[selectType] || []);
    }
    return cards;
  }, [data, selectType]);

  let typeMenus = useMemo(() => {
    let menus = [];
    let total = 0;
    let { types, typeToCards } = data;
    types.map((type) => {
      let typeTotal = (typeToCards[type] || []).length;
      menus.push({ key: type, total: typeTotal });
      total += typeTotal;
    });
    menus.unshift({ key: "全部", total });
    return menus;
  }, [data]);

  let contextValue = {
    selectType,
    setSelectType,
    typeCards,
    typeMenus,
    addCard,
    removeCard,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="App">
        <Layout style={{ height: "100%" }}>
          <Sider
            collapsed={collapsed}
            collapsedWidth="0"
            className="rollingBox"
            width={150}
            style={{
              height: "100%",
              background: "#ffffff",
            }}
          >
            <AddCard />
            <div style={{ height: "calc(100% -24px" }} className="rollingBox">
              <TypeMenu />
            </div>
          </Sider>
          <Layout>
            <Content style={{ position: "relative" }}>
              <div className="collapsedBtn">
                <UnorderedListOutlined
                  onClick={() => {
                    setCollapsed((collapsed) => !!!collapsed);
                  }}
                />
              </div>
              <TypeCard />
            </Content>
          </Layout>
        </Layout>
      </div>
    </AppContext.Provider>
  );
}

export default App;
