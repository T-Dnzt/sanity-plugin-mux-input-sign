import {Plugin as Plugin_2} from 'sanity'

declare interface Config {
  /**
   * Enable static renditions by setting this to 'standard'
   * @see {@link https://docs.mux.com/guides/video/enable-static-mp4-renditions#why-enable-mp4-support}
   * @defaultValue 'none'
   */
  mp4_support: 'none' | 'standard'
}

export declare const defaultConfig: Config

export declare const muxInput: Plugin_2<void | Partial<Config>>

export {}
