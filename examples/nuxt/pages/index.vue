<template>
  <div class="container">
    <button @click="pay(k)" v-for="(v, k) in payList">{{ v }}</button>
  </div>
</template>

<script>
import Inipay, {
  payList,
  defaultRequestDataFieldsDummy
} from "../../../src/inipay";

export default {
  data() {
    return {
      payList
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$inipay.initialize();
    });
  },
  methods: {
    pay(gopaymethod) {
      const domain = location.origin;
      this.$inipay.pay({
        ...defaultRequestDataFieldsDummy,
        gopaymethod,
        returnUrl: `${domain}/return`,
        closeUrl: `${domain}/close`,
        popupUrl: `${domain}/popup`
      });
    }
  }
};
</script>

<style></style>
