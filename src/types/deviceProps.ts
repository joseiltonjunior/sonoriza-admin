type Platform = 'WEB'

export interface DevicePayload {
  deviceKey: string
  platform: Platform
  deviceName: string
  manufacturer: string
  model: string
  osName: string
  osVersion: string
  appVersion: string
}

export interface UserAgentBrand {
  brand: string
  version: string
}

export interface NavigatorUADataLike {
  brands: readonly UserAgentBrand[]
  mobile: boolean
  platform: string
}

export interface NavigatorWithUAData extends Navigator {
  userAgentData?: NavigatorUADataLike
}

export const WEB_DEVICE_KEY_STORAGE = '@SONORIZA:WEB_DEVICE_KEY'
