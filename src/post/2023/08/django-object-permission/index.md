---
layout: blog
title: Django Rest Frameworkでget_objectをオーバーライドする時はget_object_permissionに注意
date: 2023-08-25
tags:
 - python
 - django
---

Django Rest Frameworkで以下のようなコードを書いていたが、Owner以外でもアクセスできしまうというバグが発生した。

```py
class IsOwner(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user

class MyDetail(RetrieveAPIView):
    serializer_class = MySerializer
    permission_classes = [IsOwner]
    parser_classes = [JSONParser]

    def get_object(self):
        obj = get_object_or_404(MyModel, id=self.kwargs["id"])
        return obj
```

調べてみると、そもそも `has_object_permission` が呼び出されていない。

## 原因

調べてみると、 `get_object` をoverrideした場合は  `has_object_permission` は呼び出されない仕様のようだ。
[Django Rest Frameworkのドキュメント](https://www.django-rest-framework.org/api-guide/permissions/) にも以下のような記述がある。

> If you're writing your own views and want to enforce object level permissions, or if you override the get_object method on a generic view, then you'll need to explicitly call the .check_object_permissions(request, obj) method on the view at the point at which you've retrieved the object.

## 解決策

上記の通り、 `check_object_permissions` を明示的に呼び出す。

```diff-py
 class IsOwner(BasePermission):
     def has_permission(self, request, view):
         return request.user.is_authenticated
 
     def has_object_permission(self, request, view, obj):
         return obj.owner == request.user
 
 class MyDetail(RetrieveAPIView):
     serializer_class = MySerializer
     permission_classes = [IsOwner]
     parser_classes = [JSONParser]
 
     def get_object(self):
         obj = get_object_or_404(MyModel, id=self.kwargs["id"])
+        self.check_object_permissions(self.request, obj)
         return obj
```

テストを書いていたから気付けたものの、普通に危ない仕様。

## References

- [python \- Django's DRF has\_object\_permission method not called with get\_object \- Stack Overflow](https://stackoverflow.com/questions/74893820/djangos-drf-has-object-permission-method-not-called-with-get-object)
- [Permissions \- Django REST framework](https://www.django-rest-framework.org/api-guide/permissions/)
 
