---
marp: true
paginate: true
---

# 実装の面から見る NFT

---

## 自己紹介

- [haryu703](https://twitter.com/haryu703)
- コインチェック株式会社 (2020~)
- Ethereum 系は人並み
- 普段は BCH など

---

## 登場する用語

- NFT
  - Non-Fungible Token
  - 今回は代表的な規格とその実装を読みながら意味するところを確認する
- [ERC721](https://eips.ethereum.org/EIPS/eip-721)
  - Non-Fungible Token Standard
  - NFT を表現するための規格
- スマートコントラクト
  - ブロックチェーン上の検証可能な実行環境により実行されるプログラム
- Solidity
  - Ethereum 上で動作するスマートコントラクトを実装するための言語の 1 つ
  - 同様の言語に[Vyper](https://vyper.readthedocs.io/en/stable/)や[Fe](https://fe-lang.org/)などがある

---

## 簡単な ERC721 をデプロイしてみる

1. https://wizard.openzeppelin.com/#erc721 にアクセスする
1. 「Open in Remix」をクリックする
1. 左のバーから「SOLIDITY COMPILER」の欄を選択し、「Compile contract~.sol」をクリックする
1. 左のバーから「DEPLOY & RUN TRANSACTIONS」を選択し、「CONTRACT」を「MyToken」にして「Deploy」をクリックする

---

## コードを読んでみる

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts@4.4.2/token/ERC721/ERC721.sol";

contract MyToken is ERC721 {
    constructor() ERC721("MyToken", "MTK") {}
}
```

- ERC721.sol が実装のほぼ全て
- デプロイすると`constructor`が実行され、記述された状態や処理などがブロックチェーン上に保存される

---

## ERC721 のコントラクト

[ERC721.sol#L19](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/token/ERC721/ERC721.sol#L19)

```
contract ERC721 is Context, ERC165, IERC721, IERC721Metadata {
```

- `I`で始まるのは実装のないインターフェース
- `IERC721`の要求するインターフェースを満たしていれば ERC721 規格

---

## State Variables

[ERC721.sol#L23-L39](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/token/ERC721/ERC721.sol#L23-L39)

```
    // Token name
    string private _name;

    // Token symbol
    string private _symbol;

    // Mapping from token ID to owner address
    mapping(uint256 => address) private _owners;

    // Mapping owner address to token count
    mapping(address => uint256) private _balances;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;
```

- これらの値はブロックチェーン上に保存され、操作や参照することができる

---

## ERC721 の constructor

[ERC721.sol#L44-L47](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/token/ERC721/ERC721.sol#L44-L47)

```
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
    }
```

- NFT の名前とティッカーシンボルを初期化する

---

## トークンの発行

[ERC721.sol#L280-L290](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/token/ERC721/ERC721.sol#L280-L290)

```
    function _mint(address to, uint256 tokenId) internal virtual {
        // 略

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }
```

- 受け取るアドレスとトークンの ID を指定して発行する
- constructor から呼び出したりインターフェースを公開して発行する必要がある
  - 例として使っている`MyToken`はそのままだと 1 つも発行できない
  - Contracts Wizard で Mintable にチェックを入れるとインターフェースを公開できる

---

## トークンの移動

[ERC721.sol#L327-L345](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.4.2/contracts/token/ERC721/ERC721.sol#L327-L345)

```
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual {
        // 略

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }
```

- 所有者のアドレス、宛先のアドレスおよびトークンの ID を指定して移動する

---

## 終わりに

- NFT は実装だけみるとただの ID とアドレスのペア
- ID に紐付ける情報によって NFT が表現するものや用途は変わる
- 他の Dapps との連携やコントラクトの拡張など様々な応用も考えられている
