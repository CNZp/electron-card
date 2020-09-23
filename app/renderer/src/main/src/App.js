import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import { ipcRenderer } from "electron";
//const {ipcRenderer} = window.require('electron');

import { Button, Layout, Tabs } from "antd";
import TypeMenu from "./components/TypeMenu";
import { UnorderedListOutlined } from "@ant-design/icons";
import TypeCard from "./components/TypeCard";
import AddCard from "./components/AddCard";
import AppContext from "./AppContext";
import lsApi from "./localStorageUtil";
import uuid from "uuidjs";
import SearchMenu from "./components/SearchMenu";
import TagMenu from "./components/TagMenu";
import UtilMenu from "./components/UtilMenu";
import UtilManage from "./components/UtilManage";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [data, setData] = useState({ types: [], tags: [], cards: [] });
  const [utils, setUtils] = useState([]);

  const [activeKey, setActiveKey] = useState("type");
  const [selectType, setSelectType] = useState("全部");
  const [selectTag, setSelectTag] = useState("全部");
  const [searchText, setSearchText] = useState(null);
  const [searchSelectId, setSearchSelectId] = useState(null);

  useEffect(() => {
    // lsApi.remove("cardData2");
    let dataResult = lsApi.get("cardData2");
    if (dataResult) {
      setData(dataResult);
    }
    let utilResult = lsApi.get("utilData2");
    if (utilResult) {
      setUtils(utilResult);
    }
  }, []);

  // useEffect(() => {
  //   if (activeKey === "type") {
  //     setSelectType("全部");
  //   } else if (activeKey === "tag") {
  //     setSelectTag("全部");
  //   } else if (activeKey === "search") {
  //     setSearchText(null);
  //     setSearchSelectId(null);
  //   }
  // }, [activeKey]);

  const addCard = (card) => {
    let newData = { ...data };
    let type = card.type;
    card.id = uuid.genV1().toString();
    if (newData.types.indexOf(type) === -1) {
      newData.types.push(type);
    }
    if (card.tags) {
      card.tags.map((tag) => {
        if (newData.tags.indexOf(tag) === -1) {
          newData.tags.push(tag);
        }
      });
    }
    newData.cards.push({ ...card });
    lsApi.set("cardData2", newData);
    setData(newData);
  };

  const editCard = (card) => {
    let newData = { ...data };
    let id = card.id;
    let oldType = card.oldType;
    let oldTags = [...(card.oldTags || [])];
    newData.cards.some((oldCard) => {
      if (oldCard.id === id) {
        oldCard.title = card.title;
        oldCard.type = card.type;
        oldCard.tags = card.tags;
        if (card.tags) {
          card.tags.map((tag) => {
            if (newData.tags.indexOf(tag) === -1) {
              newData.tags.push(tag);
            }
          });
        }
        oldCard.content = card.content;
        return true;
      }
    });
    let typeInTag = false;
    newData.cards.some((item) => {
      if (item.type === oldType) {
        typeInTag = true;
        return true;
      }
    });
    if (!typeInTag) {
      let removeIndex = newData.types.indexOf(oldType);
      if (removeIndex > -1) {
        newData.types.splice(removeIndex, 1);
      }
    }
    if (oldTags) {
      oldTags.map((oldTag) => {
        let tagInTag = false;
        newData.cards.some((item) => {
          if (item.tags && item.tags.indexOf(oldTag) > -1) {
            tagInTag = true;
            return true;
          }
        });
        if (!tagInTag) {
          let removeIndex = newData.tags.indexOf(oldTag);
          if (removeIndex > -1) {
            newData.tags.splice(removeIndex, 1);
          }
        }
      });
    }
    lsApi.set("cardData2", newData);
    setData(newData);
  };

  const removeCard = (card) => {
    let newData = { ...data };
    let type = card.type;
    let tags = [...(card.tags || [])];
    let cards = newData.cards;
    let removeCardIndex = -1;
    cards.some((item, index) => {
      if (item.id === card.id) {
        removeCardIndex = index;
        return true;
      }
    });
    if (removeCardIndex > -1) {
      cards.splice(removeCardIndex, 1);
      let typeInTag = false;
      cards.map((item) => {
        if (item.type === type) {
          typeInTag = true;
          return true;
        }
      });
      if (!typeInTag) {
        let removeTypeIndex = newData.types.indexOf(type);
        if (removeTypeIndex > -1) {
          newData.types.splice(removeTypeIndex, 1);
        }
        setSelectType("全部");
      }

      if (tags) {
        tags.map((oldTag) => {
          let tagInTag = false;
          newData.cards.some((item) => {
            if (item.tags && item.tags.indexOf(oldTag) > -1) {
              tagInTag = true;
              return true;
            }
          });
          if (!tagInTag) {
            let removeIndex = newData.tags.indexOf(oldTag);
            if (removeIndex > -1) {
              newData.tags.splice(removeIndex, 1);
            }
          }
        });
        setSelectTag("全部");
      }
    }
    lsApi.set("cardData2", newData);
    setData(newData);
  };

  let showCards = useMemo(() => {
    let targetCards = [];
    let { types, tags, cards } = data;
    if (activeKey === "type") {
      if (selectType === "全部") {
        targetCards = [...cards];
      } else {
        cards.map((item) => {
          if (item.type === selectType) {
            targetCards.push(item);
          }
        });
      }
    } else if (activeKey === "tag") {
      if (selectTag === "全部") {
        targetCards = [...cards];
      } else {
        cards.map((item) => {
          if (item.tags && item.tags.indexOf(selectTag) > -1) {
            targetCards.push(item);
          }
        });
      }
    } else if (activeKey === "search") {
      if (searchSelectId) {
        cards.some((item) => {
          if (item.id === searchSelectId) {
            targetCards.push(item);
            return true;
          }
        });
      }
    }
    return targetCards;
  }, [data, activeKey, selectType, selectTag, searchText, searchSelectId]);

  let showMenus = useMemo(() => {
    let menus = [];
    let { types, tags, cards } = data;
    if (activeKey === "type") {
      if (types.length) {
        let typeTotal = {};
        types.map((type) => {
          typeTotal[type] = 0;
        });
        cards.map((item) => {
          if (typeof typeTotal[item.type] === "number") {
            typeTotal[item.type]++;
          }
        });
        types.map((type) => {
          menus.push({ key: type, total: typeTotal[type] });
        });
      }
      menus.unshift({ key: "全部", total: cards.length });
    } else if (activeKey === "tag") {
      if (tags.length) {
        let tagTotal = {};
        tags.map((tag) => {
          tagTotal[tag] = 0;
        });
        cards.map((item) => {
          if (item.tags) {
            item.tags.map((tag) => {
              if (typeof tagTotal[tag] === "number") {
                tagTotal[tag]++;
              }
            });
          }
        });
        tags.map((tag) => {
          menus.push({ key: tag, total: tagTotal[tag] });
        });
      }
      menus.unshift({ key: "全部", total: cards.length });
    } else if (activeKey === "search") {
      if (searchText) {
        cards.map((item) => {
          if (item.title.indexOf(searchText) > -1) {
            var texts = item.title.split(searchText);
            menus.unshift({
              key: item.id,
              value: (
                <span>
                  {texts.map((text, index) => {
                    if (index === texts.length - 1) {
                      return text;
                    } else {
                      return (
                        <>
                          {text}
                          <span style={{ color: "#1890ff" }}>{searchText}</span>
                        </>
                      );
                    }
                  })}
                </span>
              ),
            });
          }
        });
      }
    }
    return menus;
  }, [data, activeKey, searchText]);

  let changeMenus = (isNext) => {
    if (activeKey === "type") {
      let targetIndex = -1;
      showMenus.some((menu, index) => {
        if (menu.key === selectType) {
          targetIndex = index;
          return true;
        }
      });
      if (targetIndex > -1) {
        if (isNext) {
          targetIndex++;
          targetIndex = targetIndex % showMenus.length;
        } else {
          targetIndex--;
          if (targetIndex < 0) {
            targetIndex += showMenus.length;
          }
        }
        setSelectType(showMenus[targetIndex].key);
      }
    } else if (activeKey === "tag") {
      let targetIndex = -1;
      showMenus.some((menu, index) => {
        if (menu.key === selectTag) {
          targetIndex = index;
          return true;
        }
      });
      if (targetIndex > -1) {
        if (isNext) {
          targetIndex++;
          targetIndex = targetIndex % showMenus.length;
        } else {
          targetIndex--;
          if (targetIndex < 0) {
            targetIndex += showMenus.length;
          }
        }
        setSelectTag(showMenus[targetIndex].key);
      }
    } else if (activeKey === "search") {
      let targetIndex = -1;
      showMenus.some((menu, index) => {
        if (menu.key === searchSelectId) {
          targetIndex = index;
          return true;
        }
      });
      if (targetIndex > -1) {
        if (isNext) {
          targetIndex++;
          targetIndex = targetIndex % showMenus.length;
        } else {
          targetIndex--;
          if (targetIndex < 0) {
            targetIndex += showMenus.length;
          }
        }
        setSearchSelectId(showMenus[targetIndex].key);
      }
    }
  };

  const saveUtils = ({utils})=>{
    lsApi.set("utilData2", utils);
    setUtils(utils);
  }

  const openWebview = (webviewInfo) =>{
    lsApi.set("webviewInfo", webviewInfo);
    ipcRenderer.send("open-webview");
  }

  let contextValue = {
    selectType,
    setSelectType,
    selectTag,
    setSelectTag,
    searchText,
    setSearchText,
    searchSelectId,
    setSearchSelectId,
    activeKey,

    types: data.types,
    tags: data.tags,
    showCards,
    showMenus,
    utils,

    addCard,
    editCard,
    removeCard,
    changeMenus,
    saveUtils,
    openWebview,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className="App">
        <Layout style={{ height: "100%" }}>
          <Sider
            collapsed={collapsed}
            collapsedWidth="0"
            className="rollingBox"
            width={200}
            style={{
              height: "100%",
              background: "#ffffff",
              overflow: "hidden",
            }}
          >
            <Tabs
              activeKey={activeKey}
              type="card"
              size="small"
              onChange={setActiveKey}
            >
              <Tabs.TabPane tab="分类" key="type">
                <div
                  style={{ height: "calc(100vh - 34px)", padding: "0px 10px" }}
                  className="rollingBox"
                >
                  <TypeMenu />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="标签" key="tag">
                <div
                  style={{ height: "calc(100vh - 34px)", padding: "0px 10px" }}
                  className="rollingBox"
                >
                  <TagMenu />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="查询" key="search">
                <div
                  style={{ height: "calc(100vh - 34px)", padding: "0px 10px" }}
                  className="rollingBox"
                >
                  <SearchMenu />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="工具" key="util">
                <div
                  style={{ height: "calc(100vh - 34px)", padding: "0px 10px" }}
                  className="rollingBox"
                >
                  <UtilMenu />
                </div>
              </Tabs.TabPane>
            </Tabs>
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
              {activeKey === "util" ? <UtilManage /> : <TypeCard />}
            </Content>
          </Layout>
        </Layout>
      </div>
    </AppContext.Provider>
  );
}

export default App;
