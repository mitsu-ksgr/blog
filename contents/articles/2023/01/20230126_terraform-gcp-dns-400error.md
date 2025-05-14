---
title: "Terraform: Error 400: Invalid value for 'entity.managedZone.dnsName' "
created: 2023-01-26T16:42:05.190Z
categories: ["tech", "Terraform"]
tags: ["tech", "Terraform"]
---

### エラー

GCP の Cloud DNS を Terraform から設定しようとしたところ、以下のエラーに遭遇。

```
Error creating ManagedZone: googleapi: Error 400: Invalid value for 'entity.managedZone.dnsName': 'example.com', invalid
```

そのときの tf ファイルは以下のような感じ。

```tf
resource "google_dns_managed_zone" "example-zone" {
  name        = "example-zone"
  dns_name    = "example.com"
  description = "Example DNS zone"
}
```


### 対応

`dns_name` の値の末尾に `.` が必要だった。

```tf
resource "google_dns_managed_zone" "example-zone" {
  name        = "example-zone"
  dns_name    = "example.com."
  description = "Example DNS zone"
}
```

これで解決！


### 参考
- [google\_dns\_managed\_zone \| Resources \| hashicorp/google \| Terraform Registry](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/dns_managed_zone)
- [Google Cloud DNS Bad Request Reason Invalid \- Stack Overflow](https://stackoverflow.com/questions/26826463/google-cloud-dns-bad-request-reason-invalid)


