import { Injectable } from '@angular/core';
import * as lzString from 'lz-string';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private static compressionTag = '--LZ-STRING--'

  get<T = any>(key: string) {
    const compressed = localStorage.getItem(key)

    if (compressed) {
      if (compressed.startsWith(StorageService.compressionTag)) {
        return Promise.resolve(
          this.decompressAny<T>(
            compressed.slice(StorageService.compressionTag.length)
          )
        )
      } else {
        return Promise.resolve(
          JSON.parse(compressed) as T
        )
      }
    } else {
      return Promise.resolve(
        undefined as undefined
      )
    }
  }

  set(key: string, data: any, options = { compressed: false }) {
    let compressed = ''

    if (options.compressed) {
      compressed = StorageService.compressionTag + this.compressAny(data)
    } else {
      compressed = JSON.stringify(data)
    }

    return Promise.resolve(
      localStorage.setItem(key, compressed)
    )
  }

  compressAny(data: any) {
    return lzString.compressToUTF16(JSON.stringify(data))
  }

  decompressAny<T = any>(compressed: string) {
    return JSON.parse(lzString.decompressFromUTF16(compressed)) as T
  }

  clear() {
    localStorage.clear()
  }
}
