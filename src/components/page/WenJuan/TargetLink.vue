<template>
  <div>
    <h2>{{ $route.query.link }}</h2>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
h2 {
  white-space: nowrap;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>