export const defaultRequestDataFields = {
  version: {
    name: "버전",
    required: true
  },
  mid: {
    name: "상점아이디",
    required: true
  },
  oid: {
    name: "주문번호",
    required: true
  },
  goodsname: {
    name: "상품명",
    required: true
  },
  price: {
    name: "결제금액",
    required: true
  },
  tax: {
    name: "부가세",
    required: false
  },
  taxfree: {
    name: "비과세",
    required: false
  },
  currency: {
    name: "통화구분",
    required: true
  },
  buyername: {
    name: "구매자명",
    required: true
  },
  buyertel: {
    name: "구매자 Mobile 번호",
    required: true
  },
  buyeremail: {
    name: "구매자 Email",
    required: false
  }
};

export const defaultRequestDataFieldsDummy = {
  version: "1.0",
  goodsname: "맥북프로",
  price: 1000,
  currency: "WON",
  buyername: "RUDEN",
  buyertel: "010-1234-4321"
};
export const payList = {
  VCard: "신용카드(ISP)",
  Card: "신용카드(안심클릭)",
  OCBPoint: "OK캐쉬백 포인트",
  GSPT: "GS&POINT",
  UPNT: "삼성 U-point",
  DirectBank: "실시간계좌이체(K계좌이체)",
  iDirectBank: "실시간계좌이체(I계좌이체)",
  HPP: "휴대폰",
  VBank: "무통장입금(가상계좌)",
  PhoneBill: "폰빌전화결제",
  Culture: "문화상품권",
  TeenCash: "틴캐쉬",
  DGCL: "스마트문화상품권",
  BCSH: "도서문화상품권",
  HPMN: "해피머니상품권",
  YPAY: "옐로페이",
  Auth: "빌링키발급"
};
