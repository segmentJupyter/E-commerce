import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.ecommerce',
  appPath: 'src',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  ios: {
    discardUncaughtJsExceptions: true
  }
} as NativeScriptConfig;