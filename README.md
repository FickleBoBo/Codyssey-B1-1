# Codyssey B1-1: 나를 소개하는 웹페이지 처음부터 만들기

## 프로젝트 개요

외부 라이브러리 없이 순수 HTML, CSS, JavaScript만으로 만든 반응형 포트폴리오 웹사이트입니다. 사용자 이벤트로 상태를 바꾸고, 그 상태에 맞춰 화면을 다시 그리는 흐름으로 구성했습니다.

- **배포 URL**: https://ficklebobo.github.io/Codyssey-B1-1/
- **저장소**: https://github.com/FickleBoBo/Codyssey-B1-1

### 구현 범위

- **페이지 구성**: Hero, About, Skills, Projects, Contact, Footer
- **인터랙션**: 햄버거 메뉴, 부드러운 스크롤, 스크롤 탑 버튼, 스크롤에 따른 네비게이션 스타일 변경, 다크 모드(`localStorage` 유지), 스크롤 애니메이션
- **폼**: 필수값과 이메일 형식 검증, 필드 근처 에러 메시지, 제출 성공 메시지
- **API 연동**: GitHub API로 저장소 목록을 가져와 카드로 렌더링 (로딩 / 성공 / 에러 / 빈 상태)
- **배포**: GitHub Pages

보너스 과제(필터링, 타이핑 효과, 폼 실제 전송, 시스템 다크 모드 감지)는 진행하지 않았습니다.

---

## 개발 환경

| 항목        | 값                                                 |
| ----------- | -------------------------------------------------- |
| OS          | macOS 27.0.1                                       |
| 에디터      | VSCode 1.142.0 (Live Server 확장)                  |
| 브라우저    | Chrome 155.0.8059.85                               |
| 사용 기술   | HTML5, CSS3, JavaScript (ES6+)                     |
| 외부 의존성 | 없음 (라이브러리, 웹 폰트 미사용. 아이콘은 이모지) |
| 배포        | GitHub Pages (`main` 브랜치 루트)                  |

---

## 파일 구조

```
.
├── index.html          # 메인 페이지 (시맨틱 마크업)
├── css/
│   └── style.css       # CSS 변수, 다크 모드, 레이아웃, 반응형
├── js/
│   └── main.js         # 인터랙션, 상태 관리, API 연동, 폼 검증
├── images/
│   ├── profile.png     # About 프로필 이미지
│   ├── favicon.svg
│   └── screenshot-*.png  # README 스크린샷
├── .gitignore
└── README.md
```

---

## 실행 방법

VSCode에서 Live Server 확장으로 `index.html`을 엽니다. 빌드 과정은 없습니다.

---

## 스크린샷

### 데스크톱

![데스크톱 화면](images/screenshot-desktop.png)

### 모바일

![모바일 화면](images/screenshot-mobile.png)

### 다크 모드

![다크 모드 화면](images/screenshot-dark.png)

---

## 기준값

값은 `js/main.js` 상단 상수로 정의했습니다.

| 동작                   | 상수                   | 값    |
| ---------------------- | ---------------------- | ----- |
| 네비게이션 배경 변경   | `NAV_SCROLL_THRESHOLD` | 60px  |
| 스크롤 탑 버튼 표시    | `TOP_BTN_THRESHOLD`    | 300px |
| 스크롤 애니메이션 진입 | `REVEAL_THRESHOLD`     | 0.2   |

반응형 브레이크포인트는 모바일 퍼스트로 `768px`(태블릿), `1024px`(데스크톱)입니다.
