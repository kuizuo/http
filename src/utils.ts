import LCloneDeep from 'lodash/cloneDeep'

export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'

export const cloneDeep = <T>(val: T): T => LCloneDeep(val)
/**
 *
 * @returns {string} - The fake ip
 */
export const fakeIp = () => Array(4).fill(0).map((_, i) => Math.floor(Math.random() * 255) + (i === 0 ? 1 : 0)).join('.')

