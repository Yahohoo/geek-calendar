<template>
  <div
    ref="inputWrapper"
    :class="{ active, invalid }"
    class="labeled-input">
    <label
      :class="{ active }"
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

  watch: {
    active(value) {
      if (value) {
        this.setColors('active')
      } else {
        this.setDefaultColors()
      }
    },

    invalid(value) {
      if (value) {
        this.setColors('invalid')
      } else {
        this.setDefaultColors()
      }
    },
  },

  methods: {
    setColors(theme) {
      let bdColor
      let textColor

      switch (theme) {
        case 'invalid':
          bdColor = '--invalid-color'
          textColor = '--invalid-color'
          break
        case 'active':
          bdColor = '--active-color'
          textColor = '--active-color'
          break
        default:
          break
      }

      this.$refs.inputWrapper.style.setProperty('--text-color', `var(${textColor})`)
      this.$refs.inputWrapper.style.setProperty('--bd-color', `var(${bdColor})`)
    },

    setDefaultColors() {
      this.$refs.inputWrapper.style.removeProperty('--text-color')
      this.$refs.inputWrapper.style.removeProperty('--bd-color')
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
    color: var(--text-color);
  }

  .label.active {
    padding: 0px 2px;
    top: -9px;
    font-size: 0.9rem;
  }
</style>
