import { createContext } from "react";

export default createContext({
  selectType: "",
  setSelectType: (selectType) => {},
  types: [],
  typeMenus: [],
  typeCards: [],
  addCard: (card) => {},
  editCard: (card) => {},
  removeCard: (card) => {},
  clearAllCards: () => {},
  changeMenus: (isNext) => {},
});
