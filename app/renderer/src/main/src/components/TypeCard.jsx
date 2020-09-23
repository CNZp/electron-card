import { Button, Result, Popconfirm } from "antd";
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  Fragment,
} from "react";
import AppContext from "../AppContext";
import AddCard from "./AddCard";
import {
  CloseCircleFilled,
  BlockOutlined,
  FastBackwardFilled,
  FastForwardFilled,
  CaretLeftFilled,
  CaretRightFilled,
} from "@ant-design/icons";
import EditCard from "./EditCard";
import "braft-editor/dist/output.css";

export default () => {
  const [showIndex, setShowIndex] = useState(0);
  const [showCard, setShowCard] = useState(null);
  const [contentShow, setContentShow] = useState(true);
  const {
    activeKey,
    selectType,
    selectTag,
    searchSelectId,
    showCards,
    removeCard,
    changeMenus,
  } = useContext(AppContext);

  useEffect(() => {
    if (selectType) {
      setShowIndex(0);
    }
  }, [activeKey, selectType, selectTag, searchSelectId]);

  useEffect(() => {
    if (showCards) {
      let index = showIndex;
      if (showIndex >= showCards.length) {
        index = Math.max(showCards.length - 1, 0);
        setShowIndex(index);
      }
      setShowCard(showCards[index]);
    } else {
      setShowCard(null);
    }
    // setContentShow(false);
  }, [showCards, showIndex]);

  const changeIndex = (isNext, isSide) => {
    setShowIndex((showIndex) => {
      let targetIndex = showIndex;
      let cardLength = showCards.length;
      if (isSide) {
        if (isNext) {
          targetIndex = cardLength - 1;
        } else {
          targetIndex = 0;
        }
      } else {
        if (isNext) {
          targetIndex++;
          if (targetIndex >= cardLength) {
            targetIndex = 0;
          }
        } else {
          targetIndex--;
          if (targetIndex < 0) {
            targetIndex = Math.max(cardLength - 1, 0);
          }
        }
      }
      return targetIndex;
    });
  };

  const ref = useRef();
  ref.current = { changeIndex, changeMenus };

  useEffect(() => {
    const keydown = (e) => {
      switch (e.keyCode) {
        case 37: //左
          ref.current.changeIndex(false, false);
          break;
        case 38: //上
          ref.current.changeMenus(false);
          break;
        case 39: //右
          ref.current.changeIndex(true, false);
          break;
        case 40: //下
          ref.current.changeMenus(true);
          break;
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
    };
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={ref}>
      {showCard ? (
        <div className="cardBox">
          <div className="typeCard">
            <div className="cardBtnBox">
              <EditCard oldCard={showCard} />
              <Popconfirm
                title="确认删除本卡片吗？"
                onConfirm={()=>{removeCard(showCard)}}
                okText="确认"
                cancelText="取消"
              >
                <CloseCircleFilled
                  style={{ color: "red" }}
                />
              </Popconfirm>
            </div>
            <div className="cardHeader">
              <span className="title">{showCard.title}</span>
              <span className="type">
                <span
                  style={{
                    background: "#1890ff",
                    color: "#ffffff",
                    padding: "0px 3px",
                  }}
                >
                  {showCard.type}
                </span>
                {(showCard.tags || []).map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: "#20A162",
                      color: "#ffffff",
                      marginLeft: "5px",
                      padding: "0px 3px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </span>
            </div>
            <div className="cardContent">
              {contentShow ? (
                <span className="content">
                  <div
                    className="braft-output-content"
                    dangerouslySetInnerHTML={{ __html: showCard.content }}
                  />
                </span>
              ) : (
                <div className="btnBox">
                  <Button
                    type="link"
                    onClick={() => {
                      setContentShow(true);
                    }}
                  >
                    显示内容
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div
            className="typeBtnBox"
            style={{
              justifyContent:
                activeKey == "search" ? "flex-end" : "space-between",
            }}
          >
            {activeKey != "search" ? (
              <>
                <Button
                  icon={<FastBackwardFilled />}
                  onClick={() => {
                    changeIndex(false, true);
                  }}
                >
                  开头
                </Button>
                <Button
                  icon={<CaretLeftFilled />}
                  onClick={() => {
                    changeIndex(false, false);
                  }}
                >
                  前一张（左键）
                </Button>
                <span style={{ lineHeight: "32px", fontWeight: "bold" }}>
                  ({showIndex + 1}/{showCards.length})
                </span>
                <Button
                  icon={<CaretRightFilled />}
                  onClick={() => {
                    changeIndex(true, false);
                  }}
                >
                  后一张（右键）
                </Button>
                <Button
                  icon={<FastForwardFilled />}
                  onClick={() => {
                    changeIndex(true, true);
                  }}
                >
                  结尾
                </Button>
              </>
            ) : (
              ""
            )}
            <AddCard />
          </div>
        </div>
      ) : (
        <div>
          <Result icon={<BlockOutlined />} title="暂无卡片" extra={<AddCard noBlock />} />,
        </div>
      )}
    </div>
  );
};
