<h1 align="center">
  🧀 치즈한장 백엔드
</h1>
<h3 align="center">
  Java Spring, Docker, AWS EC2(elastic beanstalk), RDS(MySQL), Tomcat
</h3>

<p align='center'>
  Public Docker Image: leejunghyeok/cheese-redis:1.2
</p>

## 서버, DB 배포 기록

<details>
  <summary><em>Cloudtype 배포 (중지됨)</em></summary>

### 4.23 cloudtype 백엔드 배포

-   mvn package: ROOT.war 생성

-   pull tomcat 9.0.88 image with docker

-   build new docker image with ROOT.war in tomcat/webapps

-   Error에 따라 cheese image의 config/properties files 수정

-   linux/amd64 platform으로 docker hub에 push

-   Cloudtype에 image tag명 (leejunghyeok/cheese:1.4)으로 Conatiner 구동

</br>

### 4.24 cloudtype MariaDB 배포, 연동

-   Mysql Workbench에서 기존 local database의 structure/data export

-   Cloudtype mariaDB template 생성 및 외부 TCP 접근 허용

-   Mysql Workbench에서 Cloudtype mariaDB 연결

-   Cloudtype mariaDB 연결된 Workbench에서 export했던 .sql import

-   leejunghyeok/cheese:1.4의 application.properties 파일에 DB 주소, password 등 수정

</br>
</details>

### 4.25 Cloudtype에서 AWS로

Cloudtype 가동 제한: 1일 1회 정지  
-> AWS에 배포하기로 함

### elastic beanstalk으로 docker container 가동하기

-   새로운 환경 생성
-   운영체제에 맞는 docker image build 및 hub에 push
-   플랫폼 docker, 로컬 코드 Dockerrunner.aws.json 업로드

</br>

Dockerrunner.aws.json

```json
{
    "AWSEBDockerrunVersion": "1",
    "Image": {
        "Name": "leejunghyeok/cheese:1.4"
    },
    "Ports": [{ "ContainerPort": "8080" }]
}
```

http://cheese.ap-northeast-2.elasticbeanstalk.com

### AWS RDS 인스턴스 생성 (중지됨)

-   보안 그룹 인바운드, 아웃바운드 설정

-   로컬 Workbench에서 연결

-   cheese db structure/data import

-   Cheese/src/resource/application.properties DB url 수정

-> 2024.04.28 비용 문제로 DB 배포 중지
