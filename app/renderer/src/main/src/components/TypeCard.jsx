import { Button, Result, Modal } from "antd";
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
  ExclamationCircleOutlined,
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
  const [contentShow, setContentShow] = useState(false);
  const { selectType, typeCards, removeCard, changeMenus } = useContext(
    AppContext
  );

  useEffect(() => {
    if (selectType) {
      setShowIndex(0);
    }
  }, [selectType]);

  useEffect(() => {
    if (typeCards) {
      let index = showIndex;
      if (showIndex >= typeCards.length) {
        index = Math.max(typeCards.length - 1, 0);
        setShowIndex(index);
      }
      setShowCard(typeCards[index]);
    } else {
      setShowCard(null);
    }
    setContentShow(false);
  }, [typeCards, showIndex]);

  const changeIndex = (isNext, isSide) => {
    setShowIndex((showIndex) => {
      let targetIndex = showIndex;
      let cardLength = typeCards.length;
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
              <CloseCircleFilled
                style={{ color: "red" }}
                onClick={() => {
                  Modal.confirm({
                    title: "确认删除本卡片吗?",
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                      removeCard(showCard);
                    },
                  });
                }}
              />
            </div>
            <div className="cardHeader">
              <span className="title">{showCard.title}</span>
              <span className="type">
                {selectType === "全部" ? "[全部]" : ""}
                {`${showCard.type} (${showIndex + 1}/${typeCards.length})`}
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

          <div className="typeBtnBox">
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
            <AddCard />
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
          </div>
        </div>
      ) : (
        <div>
          <Result title="暂无卡片" extra={<AddCard noBlock />} />,
        </div>
      )}
    </div>
  );
};
