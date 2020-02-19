# inipay-js
inipay-js는 Javascript(Node.js) 환경에서 이니시스 결제모듈을 쉽게 사용할 수 있도록 개발한 이니시스 결제 모듈 패키지입니다.
이 라이브러리를 사용하여 발생하는 손실이나 문제는 책임지지 않습니다.

## 사용 가능 결제 타입
- [x] 이니페이(웹 표준 결제)
- [ ] 이니페이(모바일 결제)

## 웹 표준 결제
- [x] 신용카드 결제
- [ ] 실시간 계좌이체
- [ ] 무통장입금(가상계좌)
- [ ] 휴대폰결제
- [ ] 포인트
- [ ] 상품권(문화상품권, 해피머니상품권, 스마트문화상품권) 
- [ ] 전화결제(ARS)
- [ ] 전자지갑
- [ ] 신용카드빌링 (빌링키 발금만 가능)

# Install

#### NPM

``` bash
yarn add inipay-js
// or
npm install --save inipay-js
```
#### with Nuxt

```javascript
// plugins/inipay.js
import Inipay from 'inipay-js';

export default function(ctx, inject) {
  inject('inipay', Inipay)
}
```

```javascript
// nuxt.config.js
{
  plugins: [
    '~/plugins/inipay'
  ]  
}
```

# Author
[Ruden](https://webruden.tistory.com)
