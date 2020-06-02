import { getExplorerHost } from "./api"
import { getUUID } from "./utils"
import store from "../store";
import { JcExplorer } from "jcc_rpc";
import { BigNumber } from 'bignumber.js';
export const getUserBalances = async (fn) => {
  let balance = {};
  let wallets = store.getters.jcWallet.wallets;
  if (!wallets) {
    for (let i = 0; i < 3; i++) {
      wallets = store.getters.jcWallet.wallets;
    }
  }
  let address = ""
  for (let wallet of wallets) {
    if (wallet.type === "swt") {
      address = wallet.address;
      break;
    }
  }
  const instExplorer = new JcExplorer(getExplorerHost());
  let res = await instExplorer.getBalances(getUUID(), "jpid2UCZuTQbWPzGy67wzFet6p5hkFuXb6");
  if (res.result) {
    let datas = res.data;
    for (let index in datas) {
      let { value, frozen } = datas[index];
      let coin = index.split("_")[0];
      if (coin.indexOf('J') === 0) {
        coin = coin.substring(1, coin.length);
      }
      let valueNum = new BigNumber(value);
      let frozenNum = new BigNumber(frozen);
      let total = parseFloat(valueNum.plus(frozenNum)) || 0;
      if (total > 0) {
        balance[`${coin}`] = { value, frozen, total };
      }
    }
    store.dispatch("updateBalance", balance);
  }
}