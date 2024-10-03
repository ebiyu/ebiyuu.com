---
layout: blog
title: ECS のタスク定義を terraform で管理しつつ、Github Actions でコンテナを更新する
date: 2024-10-03
tags:
  - terraform
  - ecs
  - github actions
---

ECSのタスク定義はterraformから定義できる。

```hcl
# ECS Service
resource "aws_ecs_service" "app" {
  name            = "${local.prefix}-app"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  ...
}

# ECS Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${local.prefix}-app"
  cpu                      = "1024"
  memory                   = "2048"
  ...

  container_definitions = jsonencode([
    ...
  ])
}

```

一方で、CI/CDを導入すると、Github Actionsなどでタスク定義を更新することがある。
- 新しくコンテナをpushした場合、そのタグに合わせてタスク定義を更新する必要がある。

この時、どのようにタスク定義を管理するかが課題となる。
- 例えば、Github Actionsでタスク定義を更新した場合、terraformで管理しているタスク定義との差異が生じる。
- この差異をどのように解消するかが課題。

## よくあるパターン
### パターン1: Github側でタスク定義を指定

例: [ecspresso利用を考慮したTerraformのECS\(Fargate\)構築 - Zenn](https://zenn.dev/shonansurvivors/articles/6bf9fe7bd09d82)

- タスク定義をGithubのリポジトリに記述し、Github Actionsでタスク定義を更新する
- terraform側では管理しない
- terraformの変数をタスク定義に埋め込む形がやりづらい
  - 環境変数など
- インスタンスサイズなど構成を変更するときに、terraform側からタスクを更新することができない
  - Github Actionsでタスク定義を更新する必要がある
  - インフラの変更とアプリケーションの変更が分離される

### パターン2: latestデプロイ

- タスク定義はterraformで定義し、latestタグを使ってデプロイする
- Github Actionsからのデプロイではlatestタグへのpushを行い、ECSの再デプロイを行うことで最新のコンテナをデプロイする
- この場合、latestタグを使うため、どのコンテナがデプロイされているかがわかりにくい
  - [あなたの組織に最適なECSデプロイ手法の考察 \| DevelopersIO](https://dev.classmethod.jp/articles/ecs-deploy-all/) にてアンチパターンとして紹介されている

## 今回のパターン

できるようにしたいこと

- タスク定義はTerraform側で管理、applyした時にちゃんと変更が効く
- Github Actions側からもコンテナを更新でき、terraform側からの最新のタスク定義が反映される

### Terraform側: latest指定で最新のコンテナを使ったタスク定義

[Terraformで構築したECSをCodePipeline等でローリング更新するとタスク定義のリビジョンがずれる問題をdataを使って回避する | DevelopersIO](https://dev.classmethod.jp/articles/terraform_ecs_codepipeline_rollingupdate_taskdef/) の方式を活用。

dataを利用すると、最新のタスク定義を参照することができる。

terraform定義を以下のように変更する。


```diff-hcl
  # ECS Service
  resource "aws_ecs_service" "app" {
    name            = "${local.prefix}-app"
    cluster         = aws_ecs_cluster.this.id
-   task_definition = aws_ecs_task_definition.app.arn
+   task_definition = data.aws_ecs_task_definition.app.arn
    desired_count   = 1
    launch_type     = "FARGATE"

    ...
  }

  # ECS Task Definition
  resource "aws_ecs_task_definition" "app" {
    ...
  }

+ data "aws_ecs_task_definition" "app" {
+   task_definition = aws_ecs_task_definition.app.family
+ }
```

### Github側: 最新のタスク定義をawsから取得し、コンテナタグを更新してデプロイ

最新のタスク定義は、aws cliで取得できる。
<!-- - ![img/66d9c3a166312a001c17fc35.png](img/66d9c3a166312a001c17fc35.png) -->

```bash
aws ecs describe-task-definition \
   --task-definition my-task-definition-family \
   --query taskDefinition > task-definition.json
```
- [https://github.com/aws-actions/amazon-ecs-deploy-task-definition](https://github.com/aws-actions/amazon-ecs-deploy-task-definition)

落としてきたタスク定義のイメージタグだけを更新して、再度デプロイする。
- Github Actionsで [aws\-actions/amazon\-ecs\-render\-task\-definition](https://github.com/aws-actions/amazon-ecs-render-task-definition) を利用すると、タスク定義のjsonを更新することができる。

ビルドしたイメージは、 `latest` タグにもpushしておく
- terraform側でタスク定義を更新した場合は `latest` タグを参照するため、最新のコンテナがデプロイされる。

これらをGithub Actionsのworkflowに記述すると以下のようになる。

{% raw %}

```yaml
- name: Build and push docker container
  run: |
    docker build -t app .
    docker tag app:latest ${{secrets.AWS_ECR_REPOSITORY_URI}}:${{github.sha}}
    docker tag app:latest ${{secrets.AWS_ECR_REPOSITORY_URI}}:latest
    docker push ${{secrets.AWS_ECR_REPOSITORY_URI}}:${{github.sha}}
    docker push ${{secrets.AWS_ECR_REPOSITORY_URI}}:latest
# deploy to ECS
- name: Get latest ECS task definition
  run: aws ecs describe-task-definition --task-definition ${{ secrets.ECS_TASK_DEFINITION }} --query taskDefinition > task_definition.json
- name: Render task definition
  id: render_task_definition
  uses: aws-actions/amazon-ecs-render-task-definition@v1
  with:
    task-definition: task_definition.json
    container-name: app
    image: ${{secrets.AWS_ECR_REPOSITORY_URI}}:${{github.sha}}
- name: Deploy to ECS (Update task definition)
  uses: aws-actions/amazon-ecs-deploy-task-definition@v1
  with:
    task-definition: ${{steps.render_task_definition.outputs.task-definition}}
    service: ${{secrets.ECS_SERVICE_NAME}}
    cluster: ${{secrets.ECS_CLUSTER_NAME}}
    wait-for-service-stability: true
```

{% endraw %}

## 困る点

terraform定義から料金を計算してくれる [infracost](https://github.com/infracost/infracost) が、正しく料金を計算してくれない。
- terraformの定義としては `data` で参照しているだけで、実際にはタスク定義が存在しない。
- そのため、CPUやメモリの値が取得できず、料金計算ができない。
- 一回計算を行うだけであれば、計算する時だけdataを用いないように書き換えればよいが、CI/CDで毎回計算するような場合は困る。

## References

- [ecspresso利用を考慮したTerraformのECS(Fargate)構築](https://zenn.dev/shonansurvivors/articles/6bf9fe7bd09d82)
- [Terraformで構築したECSをCodePipeline等でローリング更新するとタスク定義のリビジョンがずれる問題をdataを使って回避する | DevelopersIO](https://dev.classmethod.jp/articles/terraform_ecs_codepipeline_rollingupdate_taskdef/)
- [aws_ecs_task_definition に CI/CD との競合を防ぐ track_latest 引数がリリースされました | DevelopersIO](https://dev.classmethod.jp/articles/aws-ecs-task-definition-supports-track-latest-args/)
- [https://github.com/aws-actions/amazon-ecs-deploy-task-definition](https://github.com/aws-actions/amazon-ecs-deploy-task-definition)

