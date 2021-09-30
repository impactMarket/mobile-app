<div align="center">
    <img src="feature.jpeg" style="max-width: 800px"><br/><br/>
    <a href="https://expo.io/@impactmarket/"><img src="https://img.shields.io/badge/Runs%20with%20Expo-4630EB.svg?style=flat-square&logo=EXPO&labelColor=f3f3f3&logoColor=000"/></a>
    <a href="https://github.com/impactMarket/mobile-app/workflows"><img src="https://github.com/impactMarket/mobile-app/workflows/CodeQL/badge.svg"/></a>
</div>

> A decentralized impact-driven 2-sided marketplace to provide financial services to charities and vulnerable beneficiaries in need or living in extreme poverty.

Welcome to the public mobile app fraction of the impactMarket codebase.

## Installation

Use the package manager [yarn](https://yarnpkg.com/) to install dependencies.

```bash
yarn
```

Replace .env variables (use .env.example as an example)

## Usage

Install [expo](https://expo.io/) on your smartphone, start the app with `yarn start` and scan the QR.

If you have an android, you can try our demo [here](https://expo.io/@impactmarket/).

## Devices used in manual tests

This are the devices used during development and first phase manual tests. Pre-production tests have a few more devices.

Our goal is to make the app as functional as possible from the most low-end device up to the most top high-end one.

* [BLU Advance L5 (Android 8.1, 4", 512MB RAM, 1.3GHz processor with Mali-400 GPU)](https://www.amazon.com/Advance-A390L-Unlocked-Phone-Camera/dp/B07Z6Q9NCZ/)
* [SLIDE SP4514 (Android 6.0, 4.5", 1GB RAM, 1GHz processor)](https://www.amazon.com/dp/B06ZZ4KZF9?psc=1&ref=ppx_yo2_dt_b_product_details)
* [Asus ZenFone 3 Max (Android 7.0, 5.2", 3GB RAM, 1.25GHz quad-core processor)](https://www.gsmarena.com/asus_zenfone_3_max_zc520tl-8207.php)
* [iPhone 6 (iOS 12, 4.7", 1GB RAM, 1.4GHz dual-core processor)](https://www.gsmarena.com/apple_iphone_6-6378.php)

## License
[Apache-2.0](LICENSE)

Thanks to [react-svgr](https://react-svgr.com/playground/?native=true&typescript=true) to allow convert xml svg to react native svg.
