<template>
  <div class="selectors">
    <selector
      v-for="selector in selectors"
      :selections="selector.selections"
      :category="selector.category"
      :key="selector.name"
      :label="selector.name"
    />
  </div>
</template>

<script>
import selector from './selector'
import { mapGetters } from 'vuex'

export default {
  components: { selector },
  computed: {
    ...mapGetters(['selectors']),
  }
}
</script>

<style lang="scss" scoped>
  .selectors {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

