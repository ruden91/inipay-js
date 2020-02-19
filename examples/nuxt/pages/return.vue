<template>
  <div>
    <h1>이니시스 리턴페이지</h1>
    <pre>
      {{ post }}
    </pre>
  </div>
</template>

<script>
export default {
  asyncData({ req, $axios, query, app }) {
    if (process.server) {
      const post = JSON.parse(JSON.stringify(req.body));

      return {
        post
      };
    }
  }
};
</script>

<style></style>
