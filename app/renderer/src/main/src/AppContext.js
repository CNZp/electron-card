import { createContext } from "react";

export default createContext({
  selectType: "",
  setSelectType: () => {},
  typeMenus: [],
  typeCards: [],
  addCard: () => {},
  removeCard: () => {},
});
