// 토큰 세션에서 가져온다.
const token = sessionStorage.getItem("token");
const userIdEqual = sessionStorage.getItem("userId");

// 포폴값 받아오는 함수
async function getUserPortfolio() {
  let query = window.location.search;
  let idParams = new URLSearchParams(query);
  let userId = idParams.get("userId");

  const BASE_URL = "http://kdt-ai-10-team04.elicecoding.com";

  const baseInstance = axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const response = await baseInstance.get(`/api/${userId}`);
  // 유저 상세 정보 전부 선언
  const { user, education, award, certificate, project } = response.data;
  console.log(response.data);

  const myCardDiv = document.querySelector(".my-card");
  // 유저 카드 정보 선언
  const { name, email, introduce } = user[0];
  // 유저 포트폴리오 제목
  const userPortfolioName = document.querySelector(".user-portfolio-name");
  userPortfolioName.innerHTML = `<h2>${name}님의 포트폴리오</h2>`;
  // 유저 카드 출력
  myCardDiv.innerHTML = `<div class="other-card-header">
  <img
    src="/images/img-profile01.png"
    alt="profile_img"
    class="profile_img"
  />
  <div class="other-card-intro">
    <p class="card-name">${name}</p>
    <p class="card-email">${email}</p>
  </div>
</div>

<div class="my-card-content others-content">
  ${introduce}
</div>`;

  // otherspPage에서의 userId와 세션 userId가 같다면 마이페이지로 가는 버튼 생성
  if (userId === userIdEqual) {
    const myPageButton = document.querySelector(".mypage-button");
    myPageButton.innerHTML = `
    <a href="/myPage?userId=${userId}">
      <button class= "save-btn">마이페이지</button>
    </a>`;
  }

  // 학력 섹션
  const portfolioSectionEducation = document.querySelector(
    ".portfolio-section.education"
  );
  if (education.length === 0) {
    portfolioSectionEducation.innerHTML = `<div class="nothing-info">정보가 없습니다.</div>`;
  }
  education.forEach((item) => {
    const { school, major, periodStart, periodEnd } = item;
    // console.log(item);
    portfolioSectionEducation.insertAdjacentHTML(
      "beforeend",
      `
      <div class="portfolio-section-item">
        <div class= "period-start">${periodStart}</div> ~ <div class= "period-start">${periodEnd}</div>
        <div class= "name">${school}</div>
        <div class= "major">${major}</div>
      </div>
      `
    );
  });
  // 수상이력
  const portfolioSectionAward = document.querySelector(
    ".portfolio-section.award"
  );
  if (award.length === 0) {
    portfolioSectionAward.innerHTML = `<div class="nothing-info">정보가 없습니다.</div>`;
  }
  award.forEach((item) => {
    const { name, agency, awardDate } = item;
    // console.log(item);
    portfolioSectionAward.insertAdjacentHTML(
      "beforeend",
      `
      <div class="portfolio-section-item">
        <div class= "awardDate">${awardDate}</div>
        <div class= "name">${name}</div>
        <div class= "agency">${agency}</div>
      </div>
      `
    );
  });
  //자격증
  const portfolioSectionCertificate = document.querySelector(
    ".portfolio-section.certificate"
  );

  if (certificate.length === 0) {
    portfolioSectionCertificate.innerHTML = `<div class="nothing-info">정보가 없습니다.</div>`;
  }
  certificate.forEach((item) => {
    const { name, agency, licenseDate } = item;
    // console.log(item);
    portfolioSectionCertificate.insertAdjacentHTML(
      "beforeend",
      `
      <div class="portfolio-section-item">
        <div class= "period-start">${licenseDate}</div>
        <div class= "name">${name}</div>
        <div class= "major">${agency}</div>
      </div>
      `
    );
  });
  // 프로젝트
  const portfolioSectionProject = document.querySelector(
    ".portfolio-section.project"
  );
  if (project.length === 0) {
    portfolioSectionProject.innerHTML = `<div class="nothing-info">정보가 없습니다.</div>`;
  }
  project.forEach((item) => {
    const {
      name,
      link,
      contentTitle,
      contentDetail,
      periodStart,
      periodEnd,
      techStack,
    } = item;

    function detailList(contentDetail) {
      let list = contentDetail?.map((item) => {
        return `<li class = "contentDetail">${item}</li>`;
      });
      return list.join(" "); //중간중간 쉼표 존재해서 조인 쉼표를 공백으로 제거하고 배열 벗겨서 리턴
    }
    function techStackList(techStack) {
      let list = techStack?.map((item) => {
        return `<div class = "techStack">${item}</div>`;
      });
      return list.join(" "); //중간중간 쉼표 존재해서 조인 쉼표를 공백으로 제거하고 배열 벗겨서 리턴
    }
    const hrefValue = link ? link : "#n";
    const linkClass = link ? "" : "disabled-link";
    const linkBtn = link ? ">" : "";
    portfolioSectionProject.insertAdjacentHTML(
      "beforeend",
      `
      <div class="portfolio-section-item">
        <div class = "name">
          <a class = "link ${linkClass}" href="${hrefValue}" target="_blank">${name} ${linkBtn}</a>
          <div class = "proj-duration">
            <div class = "period-start">${periodStart}</div> ~ <div class = "period-end">${periodEnd}</div>
          </div>
        </div>
        <ul class = "content-title">${contentTitle}</ul>
        ${
          contentDetail !== ""
            ? detailList(contentDetail)
            : "<p>프로젝트 상세설명이 없습니다!</p>"
        }
        ${
          techStack !== ""
            ? techStackList(techStack)
            : "<p>기술스텍이 없습니다!</p>"
        }
      </div>
      `
    );
  });
}

getUserPortfolio();

const portfolioSection = [
  { className: "education", title: "학력" },
  { className: "award", title: "수상이력" },
  { className: "certificate", title: "자격증" },
  { className: "project", title: "프로젝트" },
];

// 각 섹션 토대 만드는 함수 - 박스 + 제목
const createSection = (sectionData) => {
  const section = document.createElement("div");
  section.className = "section";
  section.classList.add(sectionData.className);

  const header = document.createElement("div");
  header.className = "title-bar";

  const title = document.createElement("h3");
  title.innerText = sectionData.title;
  header.appendChild(title);
  section.appendChild(header);

  const sectionContainer = document.createElement("div");
  sectionContainer.className = `portfolio-section`;
  sectionContainer.classList.add(sectionData.className);
  section.appendChild(sectionContainer);

  return section;
};

// 포트폴리오 각 섹션 토대 업데이트 하는 함수
const updatePortfolioSections = () => {
  const portfolio = document.querySelector(".resume-content");

  portfolioSection.forEach((section) => {
    const newSection = createSection(section);
    portfolio.appendChild(newSection);
  });
};

updatePortfolioSections();
