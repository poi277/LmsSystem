# LmsSystem Project

React와 JavaSpring을 이용한 첫번째 프로젝트입니다.

## 프로젝트 구조
```
프론트 : LmsSystemFront\src\components\StudentsManageMent
백엔드 : LmsSystemBackEnd\src\main\java\rest\webservices\restfulwebservices
```

## 기능

- 이메일을 이용한 회원가입
- 비밀번호 변경
- 수강신청
- 과목의 상태변경 (개설, 휴강, 폐강, 완강)
- 과목게시물 CRUD
- 파일 업로드
- 학점 부여

## 기능 권한

**학생**
- 일반적인 서비스를 이용하는 유저입니다

**교수**
- 담당하는 과목에서의 수강한 학생들에게 학점부여 및 게시물을 관리할 수 있습니다

**관리자**
- 사용자와 모든 과목과 게시물의 상태를 관리할 수 있습니다

## 사용한 기술스택

### 프론트엔드
- HTML
- CSS
- JavaScript
- React.js

### 백엔드
- Spring Boot
- Spring Security
- JPA + Hibernate
- JWT
- SMTP

### DB
- MySQL

### 인프라/배포
- Docker
- AWS (EC2, S3, RDS)