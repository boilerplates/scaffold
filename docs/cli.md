# CLI Help


## Flags

 - `--local`: only search and use local scaffolds
 - `--global`: only search and use global scaffolds
- `--find`: find a file/template that matches the given pattern. Example `--find:post...something`


## Data


```sh
$ scaffold new data:button > data/button-success.json
```

## Posts


```sh
$ scaffold new post --type=list tags.hbs
$ scaffold new post:list tags.hbs --data
```

**Find data**

```sh
$ scaffold new post --find:data/*post
```

