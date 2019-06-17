<template>
  <div class="selectors">
    <selector
      v-for="selector in selectors"
      :key="selector.name"
      :selections="selector.selections"
      :category="selector.category"
      :label="selector.name" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import selector from './selector'

export default {
  components: { selector },

  computed: {
    ...mapGetters(['selectors']),
  },
}
</script>

<style lang="scss" scoped>
  .selectors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
