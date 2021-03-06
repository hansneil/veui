import { includes, camelCase, get, isString, isArray, isObject, assign, keys, isNaN } from 'lodash'

export function getTypedAncestorTracker (type, name = type) {
  return {
    computed: {
      [camelCase(name)] () {
        return getTypedAncestor(this, type)
      }
    }
  }
}

export function getTypedAncestor (component, type) {
  let current = component.$parent
  while (current) {
    let { uiTypes } = current.$options
    if (uiTypes && includes(uiTypes, type)) {
      return current
    }
    current = current.$parent
  }
  return null
}

/**
 * 检查组件是否是指定type或根的顶级type类型
 *
 * @param  {Component}  vm          组件实例
 * @param  {string}     type        组件uiType
 * @param  {string}     [scopeType] 指定查找的父组件uiTypes范围
 * @return {Boolean}                检查结果
 */
export function isTopMostOfType (vm, type, scopeType) {
  let parent = vm.$parent
  while (parent && !includes(get(parent, '$options.uiTypes'), type)) {
    if (scopeType && includes(get(parent, '$options.uiTypes'), scopeType)) {
      parent = null
      break
    }

    parent = parent.$parent
  }
  return !parent
}

export function getModelProp (vm) {
  return get(vm, '$options.model.prop', 'value')
}

export function getModelEvent (vm) {
  return get(vm, '$options.model.event', 'input')
}

/**
 * 表单中空输入
 *
 * @param  {Mixed}  val 输入值
 * @return {Boolean}     是否空输入
 */
export function isEmpty (val) {
  return val == null || val === '' || (Array.isArray(val) && !val.length)
}

/**
 * VUE 里面有三种设置 class 的方式：
 * 1. 字符串
 * 2. 字符串数组
 * 3. object
 * 此处统一将这些形式的 class 转换成 object 形式的
 *
 * @param {string|Array.<string>|object} klasses
 */
export function normalizeClass (klasses) {
  let klassObj = {}
  if (isString(klasses)) {
    klasses.split(/\s+/).forEach((klass) => {
      klassObj[klass] = true
    })
  } else if (isArray(klasses)) {
    klasses.forEach((klass) => {
      klassObj[klass] = true
    })
  } else if (isObject(klasses)) {
    assign(klassObj, klasses)
  }
  return klassObj
}

export function getConfigKey (name) {
  return name.replace(/^veui|-*/g, '')
}

export function stringifyQuery (query) {
  return Object.keys(query).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`).join('&')
}

const CLASS_PROP_DEF = {
  validator (value) {
    return isObject(value) || isString(value)
  },
  default: null
}

export function getClassPropDef () {
  return { ...CLASS_PROP_DEF }
}

const OPPOSITE = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right'
}

export function resolveOverlayPosition (position) {
  if (!position) {
    return {}
  }

  let [side, align] = position.split(/\s+/)
  let targetAttachment
  let attachment
  if (side === 'top' || side === 'bottom') {
    targetAttachment = `${side} ${align || 'center'}`
    attachment = `${OPPOSITE[side]} ${align || 'center'}`
  } else {
    targetAttachment = `${align || 'middle'} ${side}`
    attachment = `${align || 'middle'} ${OPPOSITE[side]}`
  }
  return {
    targetAttachment,
    attachment
  }
}

export function keepOwn (obj) {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(val => keepOwn(val))
    }

    return keys(obj).reduce((acc, key) => {
      if (key !== '__ob__') {
        acc[key] = keepOwn(obj[key])
      }
      return acc
    }, {})
  }
  return obj
}

export function parseUnit (val) {
  const value = parseFloat(val)

  if (isNaN(value)) {
    return {
      value: val,
      unit: '',
      isNumber: false
    }
  }

  return {
    value,
    unit: val.toString().replace(value, '').trim(),
    isNumber: true
  }
}
