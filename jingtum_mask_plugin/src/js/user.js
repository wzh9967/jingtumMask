import { getExplorerHost } from "./api"
import { getUUID, encrypt, decrypt } from "./utils"
import store from "store";
import { ExplorerFactory } from "jcc_rpc";
import { BigNumber } from 'bignumber.js';
import Lockr from "lockr";
// import { jtWallet } from "jcc_wallet";
const { Wallet } = require("@swtc/wallet");
const bip39 = require("bip39");
const bip32 = require("bip32");
export const getUserBalances = async (fn) => {
  let balance = {};
  // const address = store.getters.swtAddress;
  // console.log("address", address)
  // let wallets = store.getters.jcWallet.wallets;
  // if (!wallets) {
  //   for (let i = 0; i < 3; i++) {
  //     wallets = store.getters.jcWallet.wallets;
  //   }
  // }
  const instExplorer = ExplorerFactory.init(getExplorerHost());
  const res = await instExplorer.getBalances(getUUID(), 'jHXA8QvnogEw3exos7V2t3UXZmDWhDgHQT');
  if (res.result) {
    const { data } = res;
    for (const key in data) {
      const { value, frozen } = data[key];
      if (key === "_id" || key === "feeflag") {
        continue;
      }
      let coin = key.split("_")[0];
      if (coin.indexOf('J') === 0) {
        coin = coin.substring(1, coin.length);
      }
      if (coin.toUpperCase() === "CNY") {
        coin = 'CNT'
      }
      const total = value;
      const available = new BigNumber(value).minus(frozen).toString(10);
      if (new BigNumber(value).gt(0)) {
        balance[`${coin}`] = { available, frozen, total }; // total:总资产  available:可用资产  frozen:冻结资产
      }
    }
    store.dispatch("updateBalance", balance);
  }
}

export const createdWallet = (mnemonic = "") => {
  bip39.setDefaultWordlist("chinese_simplified");
  try {
    if (!mnemonic) {
      //  生成助记词
      mnemonic = bip39.generateMnemonic();
      console.log(mnemonic);
    }
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    //  通过助记词生成私钥
    const b32 = bip32.fromSeed(seed)
    let countKey = Lockr.get("countKey") || "";
    if (!countKey) {
      countKey = "0";
    } else {
      countKey = parseInt(countKey) + 1 + "";
    }
    let pathUrl = "m/44'/315'/0'/0/" + countKey;
    const privateKey = b32.derivePath(pathUrl).privateKey.toString("hex");
    let data = {
      mnemonic,
      privateKey,
      countKey,
      pathUrl
    }
    return data
  } catch (error) {
    return {}
  }
}