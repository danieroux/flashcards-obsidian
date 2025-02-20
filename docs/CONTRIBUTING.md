# Contributing
Contributions via bug reports, bug fixes, are welcome. If you have ideas about features to be implemented, please open an issue so we can discuss the best way to implement it.

## How to build?
You need to pull the repository, install the dependencies with `node` and then build with the command `npm run dev`. It will automatically move the files into the `docs/test-vault` and hot reload the plugin.

    $ git clone git@github.com:reuseman/flashcards-obsidian.git
    $ cd flashcards-obsidian
    ~/flashcards-obsidian$ npm install
    ~/flashcards-obsidian$ npm run dev

### Installing the hot-reload plugin
If you are on Linux or OSX:

`npm run bootstrap`

It does this:

`git clone https://github.com/pjeby/hot-reload.git docs/test-vault/.obsidian/plugins/hot-reload`

See: https://github.com/pjeby/hot-reload#installation
