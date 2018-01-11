<template>
  <article>
    <h1><code>&lt;veui-input-container&gt;</code></h1>
    <section class="form-block">
      <div class="form-row">
        <veui-input-container v-bind="{ prefix, value: key1, units, type: 'number'}" @change="log">
        </veui-input-container>
      </div>
      <div class="form-row">
        <veui-input-container v-bind="{ prefix, value: key2, type: 'number' }" @change="log">
          <div slot="suffix">%</div>
        </veui-input-container>
      </div>
      <div class="form-row">
        <veui-input-container v-bind="{ prefix, value: key3, type: 'number' }" @change="log">
          <veui-select v-bind="attrs" v-model="defaultValue1" slot="suffix" @change="changeValue"></veui-select>
        </veui-input-container>
    </div>
      <div class="form-row">
        <veui-input-container type="textarea" :prefix="prefix" :value="textarea1" rows=3 @input="log"></veui-input-container>
      </div>
    </section>
  </article>
</template>

<script>
import bus from '../bus'
import Select from '../../src/components/Select'
import InputContainer from '../../src/components/InputContainer'

export default {
  name: 'text-input',
  components: {
    'veui-select': Select,
    'veui-input-container': InputContainer
  },
  data () {
    return {
      key1: '200',
      units: ['像素', '厘米'],
      key2: '200',
      key3: '200',
      age: null,
      name: '李云腾',
      phone: '13800138000',
      password: null,
      hiddenValue: '隐藏值',
      textarea1: '1. 使用rows\n2. 固定3行高度\n3. 不包括padding',
      textarea2: '设置高度，同时可缩放',
      textarea3: '默认高度',
      prefix: {
        draggable: true,
        label: '高度'
      },
      suffixComp: 'veui-select',
      defaultValue1: '像素',
      preValue: '像素',
      attrs: {
        name: 'unit',
        readonly: false,
        disabled: false,
        selecticon: false,
        options: [
          {
            label: '像素',
            value: '像素'
          },
          {
            label: '厘米',
            value: '厘米'
          },
          {
            label: '英寸',
            value: '英寸'
          },
          {
            label: '毫米',
            value: '毫米'
          }
        ]
      }
    }
  },
  methods: {
    log (item, event) {
      this.key = item
      bus.$emit('log', item)
    },
    changeValue (value) {
      if (this.preValue === '像素') {
        if (value === '厘米') {
          this.key = this.key / 100 + ''
          this.preValue = value
        }
      }
    }
  }
}
</script>

<style lang="less">
@import "~less-plugin-est/src/all.less";

.form-row {
  margin-bottom: 10px;
  .clearfix();
}

.form-key {
  line-height: 42px;
  float: left;
}

.veui-input-container {
  float: left;

  .veui-input,
  .veui-textarea {
    width: 280px;
  }

  .veui-textarea {
    vertical-align: top;

    &:nth-child(1) {
      height: auto;
    }

    &:nth-child(2) {
      height: 100px;
    }
  }
}

.hidden-tips {
  line-height: 42px;
}
</style>
