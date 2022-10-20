export { default as cloneDeep } from 'lodash/cloneDeep'

export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'

/**
 *
 * @returns {string} - The fake ip
 */
export const fakeIp = () => Array(4).fill(0).map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)).join('.')

