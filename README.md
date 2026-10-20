# FickleBoBo Portfolio

외부 라이브러리 없이 순수 HTML / CSS / JavaScript로 만든 반응형 포트폴리오입니다.
모든 기능을 **이벤트 → 상태 변경 → 렌더링** 흐름으로 구성했습니다.

- 배포: <!-- TODO: GitHub Pages URL -->
- 저장소: <!-- TODO: 저장소 URL -->

| 데스크톱 | 모바일 | 다크 모드 |
|---|---|---|
| ![데스크톱](images/screenshot-desktop.png) | ![모바일](images/screenshot-mobile.png) | ![다크 모드](images/screenshot-dark.png) |

## 기술

HTML5 시맨틱 마크업 · CSS 변수 / Flexbox / Grid / 미디어 쿼리(모바일 퍼스트, 768px · 1024px) ·
ES6+ (`async/await`, 구조분해, 템플릿 리터럴, `map`/`filter`/`forEach`) · GitHub REST API · `localStorage` · `IntersectionObserver`

## 기준값

`js/main.js` 상단 상수로 조정합니다.

| 상수 | 값 | 동작 |
|---|---|---|
| `NAV_SCROLL_THRESHOLD` | 60px | 네비게이션 배경 변경 |
| `TOP_BTN_THRESHOLD` | 300px | 스크롤 탑 버튼 표시 |
| `REVEAL_THRESHOLD` | 0.2 | 스크롤 애니메이션 진입 비율 |

## 상태 → 렌더링

| 기능 | 이벤트 | 상태 | 렌더 함수 |
|---|---|---|---|
| 다크 모드 | 토글 클릭 | `themeState.dark` (+ `localStorage`) | `renderTheme` |
| Projects | 페이지 로드, 다시 시도 | `projectState.status` (`loading` / `success` / `error` / `empty`) | `renderProjects` |
| Contact 폼 | `input`, `blur`, `submit` | `formState` (touched, submitted) | `renderForm` |
| 네비게이션 | `click`, `scroll` | `nav` (menuOpen, scrollY) | `renderNav` |

## GitHub API

`https://api.github.com/users/FickleBoBo/repos`로 저장소를 가져오고 fork는 제외합니다.
로딩 / 성공 / 에러(재시도 버튼) / 빈 상태를 각각 표시합니다.
인증 없이는 시간당 60회 제한이 있으며, 초과 시(403) 에러 상태가 표시됩니다.

## 실행

VS Code Live Server로 `index.html`을 엽니다.
