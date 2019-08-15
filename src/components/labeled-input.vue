<template>
  <div
    :class="{ active, invalid }"
    class="labeled-input">
    <label
      class="label">
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },

    invalid: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
  $active: #7281f1;
  $invalid: #f44336;

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

    .bordered {
      border-color: $active;
    }

    .control {
      color: $active;
    }
  }

  .active.invalid {
    .label {
      color: $invalid;
    }

    .bordered {
      border-color: $invalid;
    }

    .control {
      color: $invalid;
    }
  }
</style>
