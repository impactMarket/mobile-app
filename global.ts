// included as part of the Celo dappkit setup
// https://docs.celo.org/celo-sdk/dappkit/setup

// const TextEncodingPolyfill = require('text-encoding');

export interface Global {
    btoa: any
    atob: any
    self: any
    Buffer: any
    process: any
    location: any
    TextEncoder: any
    TextDecoder: any
  }
  
  declare var global: Global
  if (typeof global.self === 'undefined') {
    global.self = global
  }
  if (typeof btoa === 'undefined') {
    global.btoa = function(str: any) {
      return new Buffer(str, 'binary').toString('base64')
    }
    global.atob = function(data: any) {
      return new Buffer(data, "base64").toString("binary");
    }
    // global.TextEncoder = TextEncodingPolyfill.TextEncoder
    // global.TextDecoder = TextEncodingPolyfill.TextDecoder
  }
  
  global.Buffer = require('buffer').Buffer
  global.process = require('process')
  global.location = {
    protocol: 'https'
  }