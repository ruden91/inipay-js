import merge from "lodash/merge";
import map from "lodash/map";
import isEmpty from "lodash/isEmpty";
import { sha256 } from "js-sha256";
import {
  payList,
  defaultRequestDataFields,
  defaultRequestDataFieldsDummy
} from "./utils";

class Inipay {
  constructor(options = {}) {
    let { signKey, mid } = options;
    try {
      if (!signKey || !mid) {
        throw new Error("signKey와 mid를 확인해주세요.");
      }

      this.defaultRequestDataFields = defaultRequestDataFields;
      this.mKey = sha256(signKey);
      this.mid = mid;
      this.form = null;
      this.url = null;
      this.config = merge(
        {},
        {
          version: "1.0",
          production: false,
          mode: "pc"
        },
        options
      );
    } catch (err) {
      console.error(err);
    }
  }

  initialize(formOptions) {
    this.setInipayURL();
    this.initializeInipayScript();
    this.generateForm(formOptions);
  }
  /**
   * 이니시스 스크립트 초기화 함수
   */
  initializeInipayScript() {
    const script = document.createElement("script");
    script.src = this.url;
    script.charset = "utf-8";
    script.async = true;

    document.querySelector("head").appendChild(script);
  }

  setInipayURL() {
    const { production } = this.config;

    this.url = production
      ? "https://stdpay.inicis.com/stdjs/INIStdPay.js" // production
      : "https://stgstdpay.inicis.com/stdjs/INIStdPay.js"; // test
  }

  generateForm(options) {
    const { production } = this.config;
    console.log("generateForm");
    const defaultOptions = {
      iframeSize: { width: "820px", height: "600px" },
      popup: true,
      id: this.getRandomStr(),
      name: this.getRandomStr(),
      method: "post"
    };
    const mergedOptions = merge({}, defaultOptions, options);
    const { id, name, method } = mergedOptions;
    this.form = document.createElement("form");

    this.form.setAttribute("id", id);
    this.form.setAttribute("name", name);
    this.form.setAttribute("method", method);

    if (!production) {
      console.warn("이니시스 FORM 생성완료", mergedOptions);
    }
  }

  getRandomStr() {
    return (
      "_" +
      Math.random()
        .toString(36)
        .substr(2, 9)
    );
  }

  pay(fields) {
    // oid, timestamp settings
    const { price } = fields;
    const {
      mid,
      mKey,
      config: { version, target }
    } = this;
    const { signature, oid, timestamp } = this.getProtectedFields(mid, price);
    const mergedFields = Object.assign({}, fields, {
      version,
      mid,
      signature,
      oid,
      timestamp,
      mKey
    });
    const fieldKeys = Object.keys(mergedFields);

    if (!this.validationRequiredFields(fieldKeys)) return false;

    this.attachFormBeforePay(mergedFields, target);
    this.requestInipay();
  }

  requestInipay() {
    const { mode } = this.config;

    if (mode === "pc") {
      const formID = this.form.getAttribute("id");

      if (INIStdPay) {
        INIStdPay.pay(formID);
      } else {
        console.error("이니페이 스크립트가 존재하지 않습니다.");
      }
    } else {
      this.form.submit();
    }
  }

  attachFormBeforePay(mergedFields, target) {
    if (!target) {
      target = document.body;
    }

    this.form.innerHTML = "";
    map(mergedFields, (v, k) => {
      this.appendFormInput(v, k);
    });

    target.appendChild(this.form);
  }

  getProtectedFields(mid, price) {
    const timestamp = this.getTimestamp();
    const oid = `${mid}_${timestamp}`;
    const signature = this.makeSignature(oid, price, timestamp);

    return {
      timestamp,
      oid,
      signature
    };
  }

  validationRequiredFields(fields) {
    let boolean = true;
    let missingFields = [];
    Object.keys(this.defaultRequestDataFields)
      .filter(k => this.defaultRequestDataFields[k].required)
      .map(field => {
        const hasField = fields.find(v => v === field);
        if (!hasField) {
          missingFields.push(field);
          boolean = false;
        }
      });

    if (!boolean && !this.config.production) {
      console.warn(`${missingFields.join(", ")} 필드가 누락되었습니다.`);
    }

    return boolean;
  }

  appendFormInput(value, key) {
    const input = document.createElement("input");

    input.setAttribute("type", "hidden");
    input.setAttribute("name", key);
    input.setAttribute("value", value);

    this.form.appendChild(input);
  }
  /**
   *
   * @param 주문번호 oid
   * @param 가격 price
   * @param 타임스탬프 timestamp
   */
  makeSignature(oid, price, timestamp) {
    return sha256(`oid=${oid}&price=${price}&timestamp=${timestamp}`);
  }

  // makeSignature(authToken, timestamp) {
  //   return sha256(`authToken=${authToken}&timestamp=${timestamp}`)
  // }

  getTimestamp() {
    return Date.now();
  }
}

export { payList, defaultRequestDataFields, defaultRequestDataFieldsDummy };
export default Inipay;
