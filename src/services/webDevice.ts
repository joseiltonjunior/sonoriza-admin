import {
  DevicePayload,
  NavigatorUADataLike,
  NavigatorWithUAData,
  WEB_DEVICE_KEY_STORAGE,
} from '@/types/deviceProps'

function getNavigatorUAData(): NavigatorUADataLike | undefined {
  const nav = navigator as NavigatorWithUAData
  return nav.userAgentData
}

export function getOrCreateWebDeviceKey() {
  const existing = window.localStorage.getItem(WEB_DEVICE_KEY_STORAGE)

  if (existing) {
    return existing
  }

  const generated = crypto.randomUUID()
  window.localStorage.setItem(WEB_DEVICE_KEY_STORAGE, generated)

  return generated
}

function getBrowserName() {
  const uaData = getNavigatorUAData()

  if (uaData?.brands.length) {
    const preferredBrand =
      uaData.brands.find((brand) => !/not/i.test(brand.brand)) ??
      uaData.brands[0]

    if (preferredBrand?.brand) {
      return preferredBrand.brand
    }
  }

  const ua = navigator.userAgent

  if (ua.includes('Edg/')) return 'Edge'
  if (ua.includes('Chrome/')) return 'Chrome'
  if (ua.includes('Firefox/')) return 'Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari'

  return 'Browser'
}

function getOsName() {
  const uaData = getNavigatorUAData()

  if (uaData?.platform) {
    return uaData.platform
  }

  const ua = navigator.userAgent

  if (/Windows/i.test(ua)) return 'Windows'
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS'
  if (/Android/i.test(ua)) return 'Android'
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
  if (/Linux/i.test(ua)) return 'Linux'

  return 'unknown'
}

export function buildWebDevice(appVersion: string): DevicePayload {
  const browserName = getBrowserName()
  const osName = getOsName()

  return {
    deviceKey: getOrCreateWebDeviceKey(),
    platform: 'WEB',
    deviceName: `${browserName} on ${osName}`,
    manufacturer: 'Generic',
    model: 'Browser',
    osName,
    osVersion: 'unknown',
    appVersion,
  }
}
