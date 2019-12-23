# skeleton-ts

skeleton for typescript library + vscode debuggable example

## quickstart

```sh
git clone https://github.com/devel0/skeleton-ts.git YOURDIR
cd YOURDIR
yarn install
code .
```

- hit F5 to start

## publishing library

- choose package name changing `"name"` variable in `package.json` ( if want to publish on npm checks availability with `npm view PKGNAME` )
- to publish locally use provided script `local-publish` then from another prj install using `yalc add PKGNAME`
- to publish on public repository
    - tune variables ( only for the *first time* )
        - in `package.json` set `"private":false`, `version`, `author` and `license`
        - replace `README.md` with your own
    - run `prepatch-and-publish` ( for bugfixes ) or `minor-and-publish` ( for new features )
