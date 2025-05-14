---
title: "GCF: 起動した VM インスタンスのエフェメラル IP を DNS に登録する"
created: 2023-02-09T05:23:07.884Z
categories: ["tech", "GCP", "GCF"]
tags: ["tech", "GCP", "GCE", "GCF", "Golang"]
---


### まえがき

サーバをなるべくローコストに運用したくて、

- プリエンプティブな VM インスタンスを利用
  - エフェメラル IP を使用する設定
- 使ってないときはインスタンスを停止させておく
- 使うときは GCF 経由でインスタンスを起動する

といった形にしてた。

この構成のサーバに対し、
「なるべくお金はかけずに、IP 直打ちではなくドメイン経由でアクセスしたい」
といった要望がでてきた。

今回はすでに GCF 経由でインスタンスを起動してたから、
起動後に DNS Record Set の更新をする形で対応することにした。


#### Dynamic DNS

ドメインレジストラが DDNS を無料で提供している場合は、
インスタンスの起動スクリプトかなにかで更新するほうが良さそう。

（
ぼくはドメインをお名前.com で取得するという失態を犯した。現在 Google Domains に移行中。
）

他にいい方法があるかもだけど、今回は DDNS を使えない場合の手段の一例として。


### 環境
- Go 1.19
- Google Cloud Function



### 実装例

（以下のコードは抜粋的なアレなので、お手元でいい感じにアレしてください）

GCE まわりの操作を行うヘルパー関数を実装する。

```go
import (
    "context"
    "fmt"

    compute "cloud.google.com/go/compute/apiv1"
    computepb "cloud.google.com/go/compute/apiv1/computepb"
    "golang.org/x/oauth2/google"
    "google.golang.org/api/dns/v1"
)


type ComputeEngineInfo struct {
	Id      uint64 `json:"-"`
	Name    string `json:"name"`
	Status  string `json:"status"`
	NatIP   string `json:"nat_ip"`
}

type DNSRecordInfo struct {
	Name  string `json:"name"`
	IP    string `json:"ip"`
	TTL   int64  `json:"ttl"`
	Type  string `json:"-"`
}


// Start a compute engine instance.
// - https://pkg.go.dev/cloud.google.com/go/compute/apiv1#InstancesClient.Start
func startInstance(projectId, zoneId, instanceName string) error {
	ctx := context.Background()

	client, err := compute.NewInstancesRESTClient(ctx)
	if err != nil {
		return fmt.Errorf("NewInstancesRESTClient: %v", err)
	}
	defer client.Close()

	req := &computepb.StartInstanceRequest{
		Project:  projectId,
		Zone:     zoneId,
		Instance: instanceName,
	}

	op, err := client.Start(ctx, req)
	if err != nil {
		return fmt.Errorf("unable to start instance: %v", err)
	}

	if err = op.Wait(ctx); err != nil {
		return fmt.Errorf("unable to wait for the operation: %v", err)
	}

	// Instance started!
	return nil
}

// Get status of the compute engine instance.
// - https://cloud.google.com/compute/docs/reference/rest/v1/instances/get
// - https://pkg.go.dev/cloud.google.com/go/compute/apiv1#InstancesClient.Get
func getInstanceInfo(projectId, zoneId, instanceName string) (*ComputeEngineInfo, error) {
	ctx := context.Background()

	client, err := compute.NewInstancesRESTClient(ctx)
	if err != nil {
		return nil, fmt.Errorf("NewInstancesRESTClient: %v", err)
	}
	defer client.Close()

	req := &computepb.GetInstanceRequest{
		Project:  projectId,
		Zone:     zoneId,
		Instance: instanceName,
	}

	resp, err := client.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("unable to get instance: %v", err)
	}

	ret := ComputeEngineInfo{
		Id:   *resp.Id,
		Name: *resp.Name,
	}
	if resp.Status != nil {
		ret.Status = *resp.Status
	} else {
		ret.Status = "UNKNOWN"
	}
	if len(resp.NetworkInterfaces) > 0 && len(resp.NetworkInterfaces[0].AccessConfigs) > 0 {
		ac := resp.NetworkInterfaces[0].AccessConfigs[0]
		if ac.NatIP != nil {
			ret.NatIP = *ac.NatIP
		}
	}

	return &ret, nil
}

func updateDNSRecordIP(projectId, zoneName, domainName, rrsetType, updateIP string) (*DNSRecordInfo, error) {
	ctx := context.Background()

	client, err := google.DefaultClient(ctx, dns.CloudPlatformScope)
	if err != nil {
		return nil, fmt.Errorf("googleDefaultClient: %v", err)
	}

	dnsService, err := dns.New(client)
	if err != nil {
		return nil, fmt.Errorf("dns.New: %v", err)
	}

	// Make ResourceRecordSet
	// https://pkg.go.dev/google.golang.org/api/dns/v1#ResourceRecordSet
	patch := &dns.ResourceRecordSet{
		Rrdatas: []string{updateIP},
	}

	resp, err := dnsService.ResourceRecordSets.Patch(
		projectId, zoneName, domainName, rrsetType, patch,
	).Context(ctx).Do()
	if err != nil {
		return nil, fmt.Errorf("Unable to update ResourceRecordSets: %v", err)
	}

	ret := &DNSRecordInfo{
		Name: resp.Name,
		Type: resp.Type,
		TTL:  resp.Ttl,
	}
	if len(resp.Rrdatas) > 0 {
		ret.IP = resp.Rrdatas[0]
	}

	return ret, nil
}
```

これらの関数を利用して、サーバーの起動と DNS Record Set の更新を行う。

```go
const (
	PROJECT_ID = "myproject"
	ZONE_ID    = "asia-northeast1-b"
	ZONE_NAME  = "butsu-zone"
)

func startServer(instanceName, domainName string) error {
	// VM インスタンスを起動.
	if err = startInstance(PROJECT_ID, ZONE_ID, instanceName); err != nil {
		return fmt.Errorf("Failed to start server [%s]: %v", instanceName, err),
	}

	// 最新のインスタンス情報を取得.
	instance, err = getInstanceInfo(PROJECT_ID, ZONE_ID, instanceName)
	if err != nil {
		return fmt.Errorf("Failed to fetch server [%s] info: %v", instanceName, err),
	}

	// IP を最新のものに更新.
	info, err := updateDNSRecordIP(PROJECT_ID, ZONE_NAME, domainName, "A", instance.NatIP)
	if err != nil {
		return fmt.Errorf("Failed to update the DNS Record [%s]: %v", domainName, err),
	}

	return nil
}
```

GCF のエントリーポイントに設定してある関数から `startServer` 関数を呼び出す。　

```go
func EntryFunction(w http.ResponseWriter, r *http.Request) {
	resp := startServer("dev-server", "dev.example.net.")
	fmt.Fprintf(w, toJson(resp))
}
```


### TTL

起動してから実際にドメイン経由でアクセスできるようになるまでの時間は、
DNS Record Set に設定している TTL の値に影響される。

ぼくは `300` で運用してる。

起動直後は接続できないことが多いけど、
５分待てば接続できるようになるため（実際は２分程度で繋がることが多い印象）、
いまのところ問題にはなってない。

このあたりはサーバの用途に依存するけど、
「すぐに接続出来るようにしたい！」といったケースでは、
素直に静的 IP を利用した方がよさそう。


