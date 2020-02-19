<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    alert("다시 결제를 진행해주세요.");
    this.injectScript();
  },
  methods: {
    injectScript() {
      let script = document.createElement("script");
      script.src = "https://stdpay.inicis.com/stdjs/INIStdPay_close.js";
      script.chartset = "utf-8";
      document.querySelector("head").appendChild(script);
    }
  }
};
</script>

<style></style>
