# team04

# Xhibit

<div align='center'>

<img alt="Xhibit로고" src="./crafters/logo.png">

</div>

<br />

## Xhibit 서비스 링크

> http://kdt-ai-10-team04.elicecoding.com/

#### 테스트 계정

- 일반 유저

  - ID: michole62@test.com
  - PW: test123@
  - ID: crafters@test.com
  - PW: test123@
    <br />

## : Xhibit 소개

### Xhibit이라고 지은 이유는?

- Xhibit은 "exhibit(전시하다)"라는 단어에서 착안했습니다.
  "X"는 종종 "cross(가로지르다)"나 "intersection(교차점)"을 상징하는 문자로 사용됩니다.
  따라서 "Xhibit"는 다양한 작품을 한데 모아 전시하고 공유하는 개념을 내포하고 있습니다. 또한 "X"가 주는 강렬한 인상과 "hibit"의 발음이 "exhibit"를 연상시켜 주목성이 높고 기억하기 쉬운 이름입니다. 포트폴리오를 전시하고 공유하는 웹사이트의 성격과 잘 부합하는 의미와 발음을 가진 로고 이름입니다.

#### 유저 포트폴리오들을 한데 모아서 유저들이 PR을 선보일수 있는 공간을 제공합니다.

1. 회원가입, 로그인, 회원정보 수정 및 탈퇴 등 사용자 관련 CRUD를 할 수 있습니다.
2. 학력 관련 CRUD, 수상이력 관련 CRUD, 자격증 관련 CRUD, 프로젝트 관련 CRUD를 할 수 있습니다.
3. 반응형 사이트를 구현했습니다.

<br />

### 피그마 링크

https://www.figma.com/file/euv3OvywqneMy36YhP8pRy/Elice_Project1?type=design&node-id=2-2&mode=design&t=KwGpzSreVOXydJ1n-0

### DB Diagram

![poster](./crafters/diagram.png)

<br />

### :page_facing_up: 페이지 별 화면

|                                                         |                                                         |
| ------------------------------------------------------- | ------------------------------------------------------- |
| ![image](./crafters/signUp.png)                         | ![image](./crafters/signUpError.png)                    |
| 회원가입 페이지                                         | 회원가입 유효성 검사1                                   |
| ![image](./crafters/signUpError2.png)                   | ![image](./crafters/signUpError3.png)                   |
| 회원가입 유효성 검사2                                   | 회원가입 유효성 검사3                                   |
| ![image](./crafters/main.png)                           | ![image](./crafters/mycard2.png)                        |
| 메인페이지                                              | 메인페이지에서 본인이 등록한 포트폴리오 카드 확인       |
| ![image](./crafters/otherspage.png)                     | ![image](./crafters/mainTootherspage.png)               |
| 다른사람 페이지                                         | 다른사람 페이지에서 본인일 경우 - 마이페이지로 이동가능 |
| ![image](./crafters/default.png)                        | ![image](./crafters/add.png)                            |
| 마이페이지에서 입력된 정보                              | 마이페이지에서 추가 버튼 클릭 시                        |
| ![image](./crafters/addtoast.png)                       | ![image](./crafters/modifiedtoast.png)                  |
| 마이페이지에서 입력 후 확인버튼 누를시 토스트 팝업 등장 | 수정버튼 클릭후 확인 버튼 누를 시 토스트 팝업 등장      |
| ![image](./crafters/deletebutton.png)                   | ![image](./crafters/chip.png)                           |
| 마이페이지에서 삭제 버튼 클릭 시 모달창이 등장.         | 프로젝트에서 칩을 사용하여 기술 스택을 추가             |
| ![image](./crafters/otherchip.png)                      | ![image](./crafters/button.png)                         |
| 다른사람 페이지에서는 위와 같은 스타일 적용             | 비밀번호, 유저 탈퇴 버튼                                |
| ![image](./crafters/passwordChange.png)                 | ![image](./crafters/passwordChangeError.png)            |
| 비밀번호 변경 기능                                      | 비밀번호 변경 유효성 검사                               |
| ![image](./crafters/resign.png)                         | ![image](./crafters/deleteUser.png)                     |
| 유저 탈퇴 기능                                          | 유저 탈퇴 유효성 검사                                   |

<br />

## :hammer_and_wrench: 기술 스택

![image](./crafters/stack.png)

<br />

## 제작자

| 이름   | 담당 업무    |
| ------ | ------------ |
| 민선옥 | 팀장/백엔드  |
| 강민규 | 조원/백엔드  |
| 고나은 | 조원/프론트  |
| 구 현  | 조원/프론트  |
| 임도헌 | 조원/풀스택  |


<br />

## :runner: 로컬 실행 방법

1. 레포지토리를 클론하고자 하는 디렉토리에서 아래 명령어를 수행

   ```
   git clone <레포지토리 주소>
   ```

<br>

2. 클론한 디렉토리에서 backend 디렉토리로 들어가 아래 명령어를 통해 backend에서 필요한 module 설치

   ```
   npm install
   ```

<br>

앱을 테스트하고 싶은 경우 다음의 몽고DB URL을 이용하세요.

- `mongodb+srv://myname:jM7DA5XYx1tyqNer@cluster0.3jc98iw.mongodb.net/`
  <br>

4. express 앱을 실행

   ```
   npm run start
   ```

<br>
