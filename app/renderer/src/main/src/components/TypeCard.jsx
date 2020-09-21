import { Button } from "antd";
import React, { useState, useContext, useEffect } from "react";
import AppContext from "../AppContext";

export default () => {
  const [showIndex, setShowIndex] = useState(0);
  const [showCard, setShowCard] = useState(null);
  const { selectType, typeCards, removeCard } = useContext(AppContext);

  useEffect(() => {
    if (selectType) {
      setShowIndex(0);
    }
  }, [selectType]);

  useEffect(() => {
    if (typeCards) {
      let index = showIndex;
      if (showIndex >= typeCards.length) {
        index = typeCards.length - 1;
        setShowIndex(typeCards.length - 1);
      }
      setShowCard(typeCards[index]);
    } else {
      setShowCard(null);
    }
  }, [typeCards, showIndex]);

  return (
    <>
      {showCard ? (
        <div className="cardBox">
          <div className="typeCard">
            <div className="cardHeader">
              <span>{showCard.title}</span>
            </div>
            <div className="cardContent ">
              <span>{showCard.content}</span>
            </div>
          </div>

          <div className="typeBtnBox">
            <Button>上一张</Button>
            <Button>查 看</Button>
            <Button>下一张</Button>
          </div>
        </div>
      ) : (
        "暂无卡片"
      )}
    </>
  );
};
