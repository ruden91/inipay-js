import merge from 'lodash/merge'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import { sha256 } from 'js-sha256'
const defaultRequestDataFields = {
  version: {
    name: '버전',
    required: true
  },
  mid: {
    name: '상점아이디',
    required: true
  },
  oid: {
    name: '주문번호',
    required: true
  },
  goodsname: {
    name: '상품명',
    required: true
  },
  price: {
    name: '결제금액',
    required: true
  },
  tax: {
    name: '부가세',
    required: false
  },
  taxfree: {
    name: '비과세',
    required: false
  },
  currency: {
    name: '통화구분',
    required: true
  },
  buyername: {
    name: '구매자명',
    required: true
  },
  buyertel: {
    name: '구매자 Mobile 번호',
    required: true
  },
  buyeremail: {
    name: '구매자 Email',
    required: false
  }
}

class Inipay {
  constructor(options = {}) {
    const { signKey, mid } = options
    try {
      if (!signKey || !mid) {
        throw new Error('signKey와 mid를 확인해주세요.')
      }
      this.defaultRequestDataFields = defaultRequestDataFields
      this.mKey = sha256(signKey)
      this.mid = mid
      this.form = null

      this.config = merge(
        {},
        {
          version: '1.0',
          production: false,
          mode: 'pc'
        },
        options
      )
    } catch (err) {
      console.error(err)
    }
  }

  initialize(formOptions) {
    this.initializeInipayScript(this.config)
    this.generateForm(formOptions)
  }
  /**
   * 이니시스 스크립트 초기화 함수
   * @param {
   *  production // boolean
   * } options
   */
  initializeInipayScript({ production }) {
    const url = production
      ? 'https://stdpay.inicis.com/stdjs/INIStdPay.js' // production
      : 'https://stgstdpay.inicis.com/stdjs/INIStdPay.js' // test

    const script = document.createElement('script')
    script.src = url
    script.charset = 'utf-8'
    script.async = true

    document.querySelector('head').appendChild(script)
  }

  generateForm(options) {
    const { production } = this.config
    const defaultOptions = {
      iframeSize: { width: '820px', height: '600px' },
      popup: true,
      id: this.getRandomStr(),
      name: this.getRandomStr(),
      method: 'post'
    }
    const mergedOptions = merge({}, defaultOptions, options)
    const { id, name, method } = mergedOptions
    this.form = document.createElement('form')

    this.form.setAttribute('id', id)
    this.form.setAttribute('name', name)
    this.form.setAttribute('method', method)

    if (!production) {
      console.warn('이니시스 FORM 생성완료', mergedOptions)
    }
  }

  getRandomStr() {
    return (
      '_' +
      Math.random()
        .toString(36)
        .substr(2, 9)
    )
  }

  pay(fields) {
    // oid, timestamp settings
    const { price } = fields
    const {
      mid,
      mKey,
      config: { version, mode, target }
    } = this
    const { signature, oid, timestamp } = this.getProtectedFields(mid, price)
    const mergedFields = Object.assign({}, fields, {
      version,
      mid,
      signature,
      oid,
      timestamp,
      mKey
    })
    const fieldKeys = Object.keys(mergedFields)

    if (!this.validationRequiredFields(fieldKeys)) return false

    map(mergedFields, (v, k) => {
      this.appendFormInput(v, k)
    })

    target.appendChild(this.form)

    if (mode === 'pc') {
      const formID = this.form.getAttribute('id')
      INIStdPay.pay(formID)
    } else {
      this.form.submit()
    }
  }

  getProtectedFields(mid, price) {
    const timestamp = this.getTimestamp()
    const oid = `${mid}_${timestamp}`
    const signature = this.makeSignature(oid, price, timestamp)

    return {
      timestamp,
      oid,
      signature
    }
  }

  validationRequiredFields(fields) {
    let boolean = true
    let missingFields = []
    Object.keys(this.defaultRequestDataFields)
      .filter((k) => this.defaultRequestDataFields[k].required)
      .map((field) => {
        const hasField = fields.find((v) => v === field)
        if (!hasField) {
          missingFields.push(field)
          boolean = false
        }
      })

    if (!boolean && !this.config.production) {
      console.warn(`${missingFields.join(', ')} 필드가 누락되었습니다.`)
    }

    return boolean
  }

  appendFormInput(value, key) {
    const input = document.createElement('input')

    input.setAttribute('type', 'hidden')
    input.setAttribute('name', key)
    input.setAttribute('value', value)

    this.form.appendChild(input)
  }
  /**
   *
   * @param 주문번호 oid
   * @param 가격 price
   * @param 타임스탬프 timestamp
   */
  makeSignature(oid, price, timestamp) {
    return sha256(`oid=${oid}&price=${price}&timestamp=${timestamp}`)
  }

  // makeSignature(authToken, timestamp) {
  //   return sha256(`authToken=${authToken}&timestamp=${timestamp}`)
  // }

  getTimestamp() {
    return Date.now()
  }
}

export default Inipay
