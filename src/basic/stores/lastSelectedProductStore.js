import { Store } from "./index";

const lastSelectedProductStore = new Store({
  lastSelectedItem: null,
});

export const getLastSelectedItem = () => lastSelectedProductStore.getState().lastSelectedItem;
export const setLastSelectedItem = (item) =>
  lastSelectedProductStore.setState({ lastSelectedItem: item });

export default lastSelectedProductStore;
