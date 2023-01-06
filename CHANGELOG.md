## [0.2.7](https://github.com/autosoftoss/autorepo-api/compare/v0.2.6...v0.2.7) (2023-01-06)


### Bug Fixes

* bump dependencies ([e2f85d4](https://github.com/autosoftoss/autorepo-api/commit/e2f85d4e26f6d1aba8c2a1d1da8bd761762987dc))
* package scripts not initialized in the correct order ([cfc1118](https://github.com/autosoftoss/autorepo-api/commit/cfc1118ae5e8757a068e079e3f2f6baecee3ad75))
* remove extra newline at end of dependency lists ([284fcc7](https://github.com/autosoftoss/autorepo-api/commit/284fcc7525cd19c95379b3e4b078fe565e678663))


### Features

* Open repo issues and releases ([0f0cb81](https://github.com/autosoftoss/autorepo-api/commit/0f0cb8125959cdfe53e5c265819898a3847935c3))



## [0.2.6](https://github.com/autosoftoss/autorepo-api/compare/v0.2.5...v0.2.6) (2023-01-06)


### Bug Fixes

* Bump @autosoft/jest-preset ([1b69898](https://github.com/autosoftoss/autorepo-api/commit/1b6989878ce30ace92049091af044506bb355779))
* Fix typo when generating coveralls README badge ([5641498](https://github.com/autosoftoss/autorepo-api/commit/56414984ab13d9c2b40f61f6fb80ddbbf1a5c45c))
* Include period in README description ([545635b](https://github.com/autosoftoss/autorepo-api/commit/545635b3156001adf45f8f20feab8685bac97326))


### Features

* Added the open command ([f813a2a](https://github.com/autosoftoss/autorepo-api/commit/f813a2aee30637908faf30b70c8a43eafd29830f))
* Include release script when initializing package.json ([27931e6](https://github.com/autosoftoss/autorepo-api/commit/27931e6690156718abefc21a2a63ed4a603af479))



## [0.2.5](https://github.com/autosoftoss/autorepo-api/compare/v0.2.4...v0.2.5) (2023-01-05)


### Bug Fixes

* clean up type issues ([d0e78a2](https://github.com/autosoftoss/autorepo-api/commit/d0e78a2fd4945c40675feea5f8360c0d036700b9))



## [0.2.4](https://github.com/autosoftoss/autorepo-api/compare/v0.2.3...v0.2.4) (2023-01-05)


### Bug Fixes

* fix incorrect init editorconfig command title ([98defa2](https://github.com/autosoftoss/autorepo-api/commit/98defa249a4dc205c8ef16c9905d3baf40841328))
* fix incorrect init source command name ([c0c6226](https://github.com/autosoftoss/autorepo-api/commit/c0c6226d72640871134922b4b48946f283508c41))
* only init package.json with packages workspace ([c7ba7bc](https://github.com/autosoftoss/autorepo-api/commit/c7ba7bce6d99392d53548f7d21d37f5aac724962))
* order bundled dependencies above dependencies on package init ([9de51b0](https://github.com/autosoftoss/autorepo-api/commit/9de51b0b277d9c18d73b5c71dcf4e2f55ea9cf08))
* push tags as well in push command ([7d51ac9](https://github.com/autosoftoss/autorepo-api/commit/7d51ac9779c96f4af66afb5f3aa35f98964cc526))
* reorder init commands ([9963978](https://github.com/autosoftoss/autorepo-api/commit/9963978d86dacef0481f52cacb8785056d51a3c6))
* set private field to true for monorepos ([a0b0837](https://github.com/autosoftoss/autorepo-api/commit/a0b0837f5090e0d171f3edb039fbb6f9b122bc91))
* stash and pop during release ([0c96241](https://github.com/autosoftoss/autorepo-api/commit/0c962416fea6337f7b867b9a9a4ee89915bec03d))
* update dependencies ([a1e79d7](https://github.com/autosoftoss/autorepo-api/commit/a1e79d7fd60d774650625f9b75b79c2920341f2c))


### Features

* add coveralls badge to README if one exists ([e5c4e67](https://github.com/autosoftoss/autorepo-api/commit/e5c4e67d3388e56ee4d01fca59b4dcf48cc4516e))
* add force flag for push and release ([4caa1c6](https://github.com/autosoftoss/autorepo-api/commit/4caa1c6bb608abe4ad2c4370f7b84b0ec8d82f05))
* init coveralls ([602e4e5](https://github.com/autosoftoss/autorepo-api/commit/602e4e5a84964acc14d84ac3f27830db880331e0))
* install autorepo on init package ([4657f07](https://github.com/autosoftoss/autorepo-api/commit/4657f0770b66d0ea403d1a690a798c18f3d057d5))
* update dependencies command ([5468eb2](https://github.com/autosoftoss/autorepo-api/commit/5468eb20a77323b54dbb982d51fe1a99711d6bb4))



## [0.2.3](https://github.com/autosoftoss/autorepo-api/compare/v0.2.2...v0.2.3) (2023-01-04)


### Bug Fixes

* checkout before resetting branch during release ([66bde0b](https://github.com/autosoftoss/autorepo-api/commit/66bde0bca708668f7f261897a97b31849a7115dc))



## [0.2.2](https://github.com/autosoftoss/autorepo-api/compare/v0.2.0...v0.2.2) (2023-01-04)


### Bug Fixes

* adjust release tagging so the correct commit is tagged ([3048a36](https://github.com/autosoftoss/autorepo-api/commit/3048a360d0d7a17f116b7141a2e2bf64e869cd79))
* don't include changelog segment header in release body ([844f425](https://github.com/autosoftoss/autorepo-api/commit/844f4251939899f56eedeb7397889607541e1cc9))
* push to release branch during release script ([d2319dd](https://github.com/autosoftoss/autorepo-api/commit/d2319dd1d9191c753345313a6c3fc179dad26981))
* remove pull request title during release script ([fb9ca0a](https://github.com/autosoftoss/autorepo-api/commit/fb9ca0a88b8c7559c48d67f12b8fdb69264dfb0d))
* reset git correctly before pulling after a release ([ff629a0](https://github.com/autosoftoss/autorepo-api/commit/ff629a01317ce77ea7c229a8034b7781af964602))



## [0.2.1](https://github.com/autosoftoss/autorepo-api/compare/v0.2.0...v0.2.1) (2023-01-04)


### Bug Fixes

* adjust release tagging so the correct commit is tagged ([de2e2ed](https://github.com/autosoftoss/autorepo-api/commit/de2e2ed5186c80b48a515c0a2d6d0bda351ffc35))
* push to release branch during release script ([4e9842c](https://github.com/autosoftoss/autorepo-api/commit/4e9842c281aa9736d0c8a45187857df33874ea52))
* remove pull request title during release script ([739c4e2](https://github.com/autosoftoss/autorepo-api/commit/739c4e234709254287c3ea675d6a4d832c50be5b))



# [0.2.0](https://github.com/autosoftoss/autorepo-api/compare/0.1.2...0.2.0) (2023-01-04)


### Bug Fixes

* init package.json with version 0.0.0 ([82bf3de](https://github.com/autosoftoss/autorepo-api/commit/82bf3de51cbeb08c8791c0ce212078f183cc3bee))


### Features

* migrate branch command ([0abb3d5](https://github.com/autosoftoss/autorepo-api/commit/0abb3d5e0209ad950fd9f4f44a21bb3c6a2033f9))
* release command ([e497b03](https://github.com/autosoftoss/autorepo-api/commit/e497b031e1605eb1985d0597ef13d0a8a6b154c6))



## [0.1.2](https://github.com/autosoftoss/autorepo-api/compare/0.1.1...0.1.2) (2023-01-03)



## [0.1.1](https://github.com/autosoftoss/autorepo-api/compare/0.1.0...0.1.1) (2023-01-03)



# 0.1.0 (2023-01-03)



