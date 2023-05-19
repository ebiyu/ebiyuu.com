---
layout: blog
title: Nginxのproxy_passをS3のurlに設定すると404になる
date: 2023-05-19
---

## 問題


AWS S3のstatic website hostingのurlに対して、nginxのリバースプロキシを設定しようとした。

nginxの設定は以下の通り。

```nginx
    location / {
        proxy_pass http://<bucket-name>.s3-website-ap-northeast-1.amazonaws.com;
    }
```

すると、該当urlへのアクセスにより "Bucket not found" エラーが表示される。


## 解決策

プロキシ先に渡すHostヘッダーを再設定する。


```diff-nginx
     location / {
+       proxy_set_header Host http://<bucket-name>.s3-website-ap-northeast-1.amazonaws.com;
        proxy_pass http://<bucket-name>.s3-website-ap-northeast-1.amazonaws.com;
     }
```

S3側ではHostヘッダを見て返すリソースを判断しているようだ。

