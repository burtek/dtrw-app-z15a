# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.8.1](https://github.com/burtek/dtrw-app-z15a/compare/v1.8.0...v1.8.1) (2025-07-16)


### Bug Fixes

* **ui:** api health badge tooltip ([eccdf7c](https://github.com/burtek/dtrw-app-z15a/commit/eccdf7cb84a97310fa7a491b304748c606f0a0bc))
* **ui:** fix TS/eslint issues ([55dd67e](https://github.com/burtek/dtrw-app-z15a/commit/55dd67e245da25f3a1ee82ee65fee39b4aa471df))

## [1.8.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.7.0...v1.8.0) (2025-07-16)


### Features

* **ui:** toasts + api status badge ([cd8d3ed](https://github.com/burtek/dtrw-app-z15a/commit/cd8d3ed5199854459741c4257b6a84134f00874b))


### Bug Fixes

* **ui/tables:** wrong headers for caretakers ([d9ced5b](https://github.com/burtek/dtrw-app-z15a/commit/d9ced5b6db166317111ba4495565c528a9f6c69a))

## [1.7.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.6.2...v1.7.0) (2025-07-16)


### Features

* **mail:** allow sending forms via email ([257fb32](https://github.com/burtek/dtrw-app-z15a/commit/257fb321fdf57fc7b6ae74fe5b0ba14c1b0eecd4))

### [1.6.2](https://github.com/burtek/dtrw-app-z15a/compare/v1.6.1...v1.6.2) (2025-07-16)


### Bug Fixes

* **pdf:** fix days calculation ([c49dbd0](https://github.com/burtek/dtrw-app-z15a/commit/c49dbd071c8960f3ab2e5b1991a78ea3602b5fec))

### [1.6.1](https://github.com/burtek/dtrw-app-z15a/compare/v1.6.0...v1.6.1) (2025-07-16)


### Bug Fixes

* **pdf:** fix PDF download ([0c0faf7](https://github.com/burtek/dtrw-app-z15a/commit/0c0faf7c8a059c76ece780a48bd85f6dbfc5db94))
* remove z15a group check, as it's moved to reverse proxy layer ([f64ede8](https://github.com/burtek/dtrw-app-z15a/commit/f64ede89f61e1880238dcea39acd9e17e0c19935))
* **ui:** auto-retry API calls ([6909bcd](https://github.com/burtek/dtrw-app-z15a/commit/6909bcd8a414ecda89ee9a5fa22e6c35265b63ce))

## [1.6.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.5.2...v1.6.0) (2025-07-15)


### Features

* **backend:** allow multiple users ([eb6092b](https://github.com/burtek/dtrw-app-z15a/commit/eb6092bb691b34a43418424633723732cc27c83e))
* **ui:** move to RTK Query ([c6f4640](https://github.com/burtek/dtrw-app-z15a/commit/c6f46405595ad3a0cd9a137f9903354a85a9c9cf))


### Bug Fixes

* **tests:** fix UI tests ([249a3f3](https://github.com/burtek/dtrw-app-z15a/commit/249a3f3fce90b31af75b2bf0fb13e426b3d0725d))

### [1.5.2](https://github.com/burtek/dtrw-app-z15a/compare/v1.5.1...v1.5.2) (2025-07-14)


### Bug Fixes

* **backend:** saving caretaker's email ([ce46d6f](https://github.com/burtek/dtrw-app-z15a/commit/ce46d6f02590e081b55ac7f336a2e5188168511a))

### [1.5.1](https://github.com/burtek/dtrw-app-z15a/compare/v1.5.0...v1.5.1) (2025-07-14)


### Bug Fixes

* **deploy:** healthcheck ([be83705](https://github.com/burtek/dtrw-app-z15a/commit/be83705c481e323e5039a6ff11d5c3a86c53452b))

## [1.5.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.4.0...v1.5.0) (2025-07-14)


### Features

* add email field for caretaker ([d7926dc](https://github.com/burtek/dtrw-app-z15a/commit/d7926dccff7a470ebc2e5da4ceeac8597be8036e))


### Bug Fixes

* **backend/pdf:** don't force filename ([e899fc7](https://github.com/burtek/dtrw-app-z15a/commit/e899fc7815ebf2fbd40a4e28fd8350a38117aea1))

## [1.4.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.3.4...v1.4.0) (2025-07-14)


### Features

* **ui/tables:** show leave days count ([30fb3a4](https://github.com/burtek/dtrw-app-z15a/commit/30fb3a4a1f3ce850bb9ff0e23b5ddef11adae9b5))


### Bug Fixes

* **deploy:** healthcheck ([b915714](https://github.com/burtek/dtrw-app-z15a/commit/b91571469b9558004f41890d7a012785a0ee2acf))
* **ui/forms:** don't allow more than 30 days on leave - app might hang ([0f82505](https://github.com/burtek/dtrw-app-z15a/commit/0f825051910dee86f934bcf425b6deff0c382a9f))
* **ui/forms:** select placeholder ([07d2630](https://github.com/burtek/dtrw-app-z15a/commit/07d2630f03de5bfbf16dcf4a99a84d1c0930756d))

### [1.3.4](https://github.com/burtek/dtrw-app-z15a/compare/v1.3.3...v1.3.4) (2025-07-14)


### Bug Fixes

* calendar field validation ([a1f26c8](https://github.com/burtek/dtrw-app-z15a/commit/a1f26c8e5659da185d569ad70b286dfbe96936dd))
* **deploy:** healthcheck + cleanup ([60da1b6](https://github.com/burtek/dtrw-app-z15a/commit/60da1b6c29dcb729bff808b6a1620bb66fa27bac))

### [1.3.3](https://github.com/burtek/dtrw-app-z15a/compare/v1.3.2...v1.3.3) (2025-07-14)


### Bug Fixes

* **deploy:** try fix deployment? ([2312821](https://github.com/burtek/dtrw-app-z15a/commit/2312821b53534ab3bcf8d591bca6d3d703e2075b))

### [1.3.2](https://github.com/burtek/dtrw-app-z15a/compare/v1.3.1...v1.3.2) (2025-07-14)


### Bug Fixes

* **deploy:** try fix deployment? ([6bd5524](https://github.com/burtek/dtrw-app-z15a/commit/6bd5524728da7926d2e29ea002fd1ee4ae1fa863))

### [1.3.1](https://github.com/burtek/dtrw-app-z15a/compare/v1.3.0...v1.3.1) (2025-07-14)


### Bug Fixes

* **deploy:** try fix deployment? ([e0ab501](https://github.com/burtek/dtrw-app-z15a/commit/e0ab501f1c8026abd4fd96ac177ef6eae57c211b))

## [1.3.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.2.3...v1.3.0) (2025-07-14)


### Features

* new title ([a1812b8](https://github.com/burtek/dtrw-app-z15a/commit/a1812b8d11ba557560ff65a47e3db35051a22d0e))


### Bug Fixes

* **deploy:** try fix deployment? ([28aacff](https://github.com/burtek/dtrw-app-z15a/commit/28aacff552798771e3f32594b3e429123509b67d))

### [1.2.3](https://github.com/burtek/dtrw-app-z15a/compare/v1.2.2...v1.2.3) (2025-07-14)


### Bug Fixes

* **backend:** dto fixes ([8787455](https://github.com/burtek/dtrw-app-z15a/commit/87874553b8f2264201385b1b8996b417d73016af))
* **backend:** proper error handling ([0b11a0d](https://github.com/burtek/dtrw-app-z15a/commit/0b11a0df5f77c53c9bba1f73e76275863a80d0a4))
* **ui/forms:** fix jobs form ([3ccf26b](https://github.com/burtek/dtrw-app-z15a/commit/3ccf26bd88165494fe049f443dee107a01bd9d03))
* **ui/forms:** small props rework ([36880f0](https://github.com/burtek/dtrw-app-z15a/commit/36880f0f073d3e5b87c9a401fcc3053d3c552449))

### [1.2.2](https://github.com/burtek/dtrw-app-z15a/compare/v1.2.1...v1.2.2) (2025-07-12)


### Bug Fixes

* **deploy:** rebuild/reinstall sqlite library on VPS ([67c570e](https://github.com/burtek/dtrw-app-z15a/commit/67c570e1cbe8155c8934ccddaf54f6abb678dbd1))

### [1.2.1](https://github.com/burtek/dtrw-app-z15a/compare/v1.2.0...v1.2.1) (2025-07-12)


### Bug Fixes

* **deploy:** add drizzle config to build output ([c6d6b10](https://github.com/burtek/dtrw-app-z15a/commit/c6d6b10973de9dfe732f5cd402fff067bc11ebc7))

## 1.2.0 (2025-07-12)


### Features

* beautiful version with radix ([468f297](https://github.com/burtek/dtrw-app-z15a/commit/468f2977b27631c55b737caafdd25371c8b4994e))
* download filled Z-15A form ([224bf0c](https://github.com/burtek/dtrw-app-z15a/commit/224bf0c529704774aab0a11f0c1598a8da62c028))


### Bug Fixes

* **tests:** fixed tests ([40882f2](https://github.com/burtek/dtrw-app-z15a/commit/40882f28bb2b33ba829f8c453a3b7dba99793092))

## [1.1.0](https://github.com/burtek/dtrw-app-z15a/compare/v1.0.0...v1.1.0) (2025-07-11)


### Features

* beautiful version with radix ([468f297](https://github.com/burtek/dtrw-app-z15a/commit/468f2977b27631c55b737caafdd25371c8b4994e))

## 1.0.0 (2025-07-05)
