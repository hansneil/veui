<template>
  <div class="veui-input-container">
    <div class="veui-input-prefix">
      <slot name="prefix">
        <div :class="{ 'veui-input-prefix-draggable': draggable }" 
          v-drag:input.range="{draggable, axis: 'x'}">{{ prefix.label }}：</div>
      </slot>
    </div>
    <veui-input
      v-model="localValue"
      v-bind="attrs"
      ref="input"
      @focus="handleEvent('focus', ...arguments)"
      @click="handleEvent('click', ...arguments)"
      @change="handleEvent('change', ...arguments)"
      @dragchange="handleEvent('change', ...arguments)"
      @input="handleEvent('input', ...arguments)"
      @keyup="handleEvent('keyup', ...arguments)"
      @keydown="handleEvent('keydown', ...arguments)"
      @keypress="handleEvent('keypress', ...arguments)">
    </veui-input>
    <div class="veui-input-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script>
import { omit, includes, extend } from 'lodash'
import Input from './Input'
import { drag } from '../directives'
import { parseUnit } from '../utils/helper'

const TYPE_LIST = ['text', 'password', 'hidden', 'textarea', 'number']

export default {
  props: {
    prefix: Object,
    ui: String,
    type: {
      type: String,
      default: 'text',
      validator (val) {
        return includes(TYPE_LIST, val)
      }
    },
    units: Array,
    autocomplete: String,
    placeholder: String,
    value: {
      type: [String, Number],
      default: ''
    },
    autofocus: Boolean,
    selectOnFocus: Boolean,
    composition: Boolean,
    resizable: Boolean,
    fitContent: Boolean
  },
  data () {
    return {
      localValue: this.value,
      draggable: this.prefix.draggable && parseUnit(this.value).isNumber && this.type === 'number'
    }
  },
  watch: {
    value (newVal) {
      this.localValue = newVal
    }
  },
  computed: {
    attrs () {
      let attrs = omit(this.$props, 'prefix',
        ...(this.type === 'number' ? ['type'] : []))

      extend(attrs, {
        isNumber: this.type === 'number'
      })

      return attrs
    }
  },
  components: {
    'veui-input': Input
  },
  methods: {
    handleEvent () {
      this.$emit(...arguments)
    }
  },
  directives: { drag }
}
</script>

