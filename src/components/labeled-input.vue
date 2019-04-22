<template>
  <div
    :class="{active: isActive}"
    class="labeled-input">
    <label 
      class="label">
      {{ label }}
    </label>
    <slot/>
  </div>

</template>

<script>
export default {
  props: {
    isActive: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  $active: #7281f1;

  .labeled-input {
    position: relative;
  }

  .label {
    pointer-events: none;
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #fff;
    transition: all 0.3s ease;
    z-index: 2;
  }

  .active {
    .label {
      padding: 0px 2px;
      top: -9px;  
      font-size: 0.9rem;
      color: $active;
    }
  }
</style>
