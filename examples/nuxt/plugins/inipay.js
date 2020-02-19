// plugins/inipay.js
import Inipay from "../../../src/inipay";

export default function(ctx, inject) {
  inject(
    "inipay",
    new Inipay({
      signKey: "SU5JTElURV9UUklQTEVERVNfS0VZU1RS",
      mid: "INIpayTest"
    })
  );
}
