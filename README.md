# Inipay
이니시스 결제 모듈 패키지

# Install

#### NPM

``` bash
yarn add inipay
// or
npm install --save inipay
```
#### with Nuxt

```javascript
// plugins/inipay.js
import Inipay from 'inipay';

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
