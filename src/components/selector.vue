<template>
  <div
    v-on-clickaway="blur"
    :class="{
      filled: isFilled,
      active: isActive,
      opened
    }"
    class="selector"
  >
    <labeled-input
      :label="label"
      :is-active="isActive"
    >
      <div
        class="main"
        @click="opened = !opened"
      >
        <div
          v-if="selected.length"
          class="current-selection"
        >
          {{ selected.map(selection => selection.title).join(', ') }}
        </div>
        <div class="control">
          <i
            v-if="selected.length"
            class="far fa-times-circle"
            @click.stop="clearSelections"
          />
          <i
            class="fa fa-chevron-down"
          />
        </div>
      </div>
    </labeled-input>
    <div class="dropdown-wrapper">
      <div
        v-if="opened"
        class="dropdown"
      >
        <label
          v-for="selection in selections"
          :key="selection.title"
          class="item"
        >
          <input
            v-model="selected"
            :value="selection"
            type="checkbox"
          >
          <div class="selection">{{ selection.title }}</div>
          <div class="checkbox">
            <i
              v-if="selected.includes(selection)"
              class="fa fa-check"
            />
          </div>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { mixin as clickaway } from 'vue-clickaway';
import labeledInput from './labeled-input.vue';

export default {
  components: {
    labeledInput,
  },

  mixins: [clickaway],

  props: {
    selections: {
      type: Array,
      default: () => [],
    },
    category: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      opened: false,
    };
  },

  computed: {
    selected: {
      get() {
        return this.$store.state.filters[this.category];
      },
      set(selection) {
        this.updateFilter({ category: this.category, selection });
      },
    },
    areAllSelected() {
      return this.selected.length == this.selections.length;
    },
    isActive() {
      return this.selected.length || this.opened;
    },
    isFilled() {
      return this.selected.length;
    },
  },

  methods: {
    ...mapMutations(['updateFilter']),
    blur() {
      this.opened = false;
    },
    clearSelections() {
      this.selected = [];
    },
  },
};
</script>

<style lang="scss" scoped>
$active: #7281f1;

.selector {
  width: 250px;
  margin-bottom: 10px;
  margin: 7px 7px;
}

.main {
  cursor: pointer;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  height: 40px;
  border: 1px solid #6a6a6a;
  border-radius: 3px;
}

.selector-name {
  top: 8px;
  position: absolute;
  background-color: #fff;
  transition: all 0.3s ease;
}

.current-selection {
  width: 85%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.control {
  display: flex;
  justify-content: flex-end;
  position: absolute;
  right: 10px;
  cursor: pointer;
}

.fa {
  transition: all 0.5s;
}

.fa-chevron-down {
  margin-left: 5px;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown {
  width: 100%;
  background-color: #fff;
  position: absolute;
  border: 1px solid #000;
  border-top: none;
  border-radius: 0 0 3px 3px;
  list-style: none;
  padding: 0;
  max-height: 300px;
  overflow-y: auto;
  z-index: 5;
}

.item {
  display: flex;
  justify-content: space-between;
  padding: 3px 15px;
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: #eceded;
  }
}

.all {
  font-weight: bolder;
  // margin-bottom: 2px;
}

[type='checkbox'] {
  display: none;
}

.checkbox {
  width: 15px;
  margin-left: 5px;
}

.selection {
  overflow-wrap: break-word;
  max-width: 90%;
}

.filled {
  .fa-chevron-down {
    display: none;
  }
}

.active {
  .selector-name {
    padding: 0px 2px;
    top: -11px;
    font-size: 0.9rem;
    color: $active;
  }

  .main,
  .dropdown {
    border-color: $active;
  }

  .control {
    color: $active;
  }
}

.opened {
  .main {
    border-radius: 3px 3px 0 0;
    border-bottom: none;
  }

  .fa-chevron-down {
    transform: rotate(180deg);
  }
}
</style>7
