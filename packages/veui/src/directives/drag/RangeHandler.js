import { pick, assign, isEqual } from 'lodash'
import BaseHandler from './BaseHandler'
import { parseUnit } from '../../utils/helper'

export default class RangeHandler extends BaseHandler {
  elms = []

  initialValues = []

  // 是否被拖动过。
  // 只有被拖动过，才记录总的拖动距离
  isDragged = false

  setOptions (options) {
    if (isEqual(this.options, options)) {
      return
    }

    super.setOptions(options)
    this.options = assign(this.options, pick(options, ['targets', 'containment', 'axis']))
    this.elms = []
  }

  start () {
    super.start()

    if (!this.elms || !this.elms.length) {
      this.elms = this.options.targets.reduce((prev, cur) => {
        prev.push(this.context.$refs[cur])
        return prev
      }, [])
    }

    this.elms.forEach((elm, index) => {
      this.initialValues[index] = elm.localValue || 0
    })
  }

  drag ({ distanceX, distanceY }) {
    super.drag()

    this.elms.forEach((elm, index) => {
      let { value, unit, isNumber } = parseUnit(this.initialValues[index])

      if (isNumber) {
        elm.focus()
        value = unit ? value + distanceX + ' ' + unit : value + distanceX
        elm.change(value)
      }
    })

    this.isDragged = true
  }

  end ({ distanceX, distanceY }) {
    super.end()

    this.isDragged = false
  }
}
