<template>
  <div>
    <h1>이니시스 리턴페이지</h1>
    <pre>
      {{ post }}
    </pre>
  </div>
</template>

<script>
import qs from "qs";

export default {
  async asyncData({ req, $axios, query, app, redirect }) {
    let cancelUrl;
    try {
      if (process.server) {
        const post = JSON.parse(JSON.stringify(req.body));

        const { resultCode, resultMsg, netCancelUrl } = post;
        if (resultCode !== "0000" && resultCode !== "00") {
          throw new Error("이니페이 인증 실패");
        }

        const timestamp = Date.now();
        let authToken = `${post.authToken}`;
        cancelUrl = netCancelUrl;
        authToken = authToken.replace(/\r|\n/g, "");
        const signature = app.$inipay.makeSignature({
          authToken,
          timestamp
        });

        // pc
        if (resultCode === "0000") {
          let { mid, authUrl, merchantData } = post;
          console.log(merchantData);
          const params = {
            mid,
            authToken,
            signature,
            timestamp,
            charset: "UTF-8",
            format: "JSON"
          };
          console.log(params);

          const res = await $axios.$post(authUrl, qs.stringify(params), {
            headers: {
              "Content-type": "application/x-www-form-urlencoded" // 필수
            }
          });

          console.log(res);
        }

        return {
          post
        };
      }
    } catch (err) {
      console.error(err);
      redirect("/");
    }
  }
};
</script>

<style></style>
