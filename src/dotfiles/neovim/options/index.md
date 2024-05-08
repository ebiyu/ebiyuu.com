---
layout: dotfiles.njk
title: neovim/オプション
---


## .vimrc

[Github](https://github.com/ebiyuu1121/dotfiles/blob/master/dot_vimrc)

vim/neovim共通で利用する設定。
最小限の設定で、快適に利用するなら必須と思っている。
これからvimrcを作る人はとりあえずこれをコピペしてから初めてもいいとまで思っている。

キーマップもあまり変更していない。
一時期は `s`  `g` あたりをプレフィックスにしていろいろとキーマップしていたが、
実は使っていないキーマップも多かったため、いろいろと整理して素のvimに近づけた。

使うようになってみると `s` キーも案外便利だということが分かる。

### インデントまわり

初期のvimはタブインデント・タブ幅8になっている。
だいたい幅4のスペースインデントを使うので、そのように設定する。
あとは各種便利機能を有効化しておく。

```vim
" インデントまわり
set expandtab " tabキーを押したらspaceを挿入
set tabstop=4
set shiftwidth=4
set softtabstop=4
set autoindent
set smartindent
set indentexpr=
set indentkeys=
```

### 連続でインデント等できるようにする

ビジュアルモードにおいて、
`>` `<` でインデント・ `<C-a>` でカウントなどを行ったときに、
ビジュアルモードが解除されなくなる。
2段階以上操作を行いたいケースがほとんどなので、必須。

```vim
vnoremap <C-a> <C-a>gv
vnoremap <C-x> <C-x>gv
vnoremap g<C-a> g<C-a>gv
vnoremap g<C-x> g<C-x>gv
vnoremap > >gv
vnoremap < <gv

noremap j gj
noremap k gk
```

### 検索まわり

```vim
set hlsearch
set incsearch
nmap <silent> <Esc><Esc> <Esc><Cmd>noh<Return>
set ignorecase " 検索文字列が小文字の場合は大文字小文字を区別なく検索する
set smartcase " 検索文字列に大文字が含まれている場合は区別して検索する
```

### emacsキーバインド

vimだけど、インサートモードではemacsキーバイントが便利。
シェルでも慣れているし。

インサート・コマンドで有効化している。

```vim
" emacs key binding in insert mode
cnoremap <c-n> <down>
cnoremap <c-p> <up>
inoremap <c-b> <left>
cnoremap <c-b> <left>
inoremap <c-f> <right>
cnoremap <c-f> <right>
inoremap <c-a> <home>
cnoremap <c-a> <home>
inoremap <c-e> <end>
cnoremap <c-e> <end>
```


### バッファ移動

複数のファイルをバッファとして開いて同時に編集する運用をよく行うので、
素早くバッファ間を切り替えられる設定を行う。

ちなみに、今開いているバッファの一覧は普段はlualineを使って表示している(後述)。

```vim
" バッファ処理関連
nnoremap <silent> L <Cmd>bnext<CR>
nnoremap <silent> H <Cmd>bprev<CR>
nnoremap <silent> Q <Cmd>bdelete<CR>
```

### マウスの有効化

実は(neo)vimは普通のエディタのように、マウスが使える。
(vimがマウス機能つきでビルドされていること、ターミナルが対応していることが必要。)

カーソル移動はもちろん範囲選択・スクロールもできる。
マウスの方が早いこともあるし、普通に便利なので有効化する。

```vim
" マウスを有効化する
set mouse=a
```

### その他

その他に細かい使いやすさが上がる設定を行っている

```vim
set backspace=indent,eol,start " backspaceを有効化する
set showcmd " 入力中のキーマップを右下に表示
set hidden " buffer切り替え時に保存を促さない
set history=1000 " コマンド履歴
set background=dark " タークテーマ
set clipboard=unnamedplus,unnamed " クリップボードの有効化
set modelines=0 " モードラインを無効化
set laststatus=2 " 常にステータス行を表示
set autoread " ファイルがvimの外で変更されたら読み込む
set scrolloff=8 " スクロールするときに、下に8行分残してスクロールする
set timeoutlen=500 " 複数からなるキーマップのタイムアウト速度
set noswapfile " バックアップを無効

" タブや末尾のスペースを可視化する
set listchars=tab:>\ ,trail:_
set list

" 対応するかっこをハイライト
set showmatch
set matchtime=1

" Y の動作を自然にする neovimだとデフォルトで入っている
nnoremap Y y$
" レジスタを汚染しないようにする
nnoremap x "_x

nnoremap <space> <nop>

" mac用
inoremap ¥ \
cnoremap ¥ \
```

## init.lua

neovimのみで利用する設定。
こうやって見るとあまり設定はいじっていない。

```lua
-- set termguicolors to enable highlight groups
vim.opt.termguicolors = true

-- load base vimrc
vim.api.nvim_exec([[source $HOME/.vimrc]], false)

-- インクリメンタルサーチを有効化
vim.o.inccommand = "split"
-- ターミナルモードでも<esc>でノーマルモードに戻れるようにする
vim.keymap.set('t', '<esc>', '<c-\\><c-n>')
```

