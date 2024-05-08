// 포폴값 받아오는 함수
async function getUserPortfolio() {
  let query = window.location.search;
  let idParams = new URLSearchParams(query);
  let userId = idParams.get("userId");

  const BASE_URL = "http://localhost:3000";

  const baseInstance = axios.create({
    baseURL: BASE_URL, // 기본 URL 설정
  });
  const response = await baseInstance.get(`/api/${userId}`);
  // 유저 상세 정보 전부 선언
  const { user, education, award, certificate, project } = response.data;
  console.log(user);

  const myCardDiv = document.querySelector(".my-card");
  // 유저 카드 정보 선언
  const { name, email, introduce } = user[0];
  // 유저 카드 출력
  myCardDiv.innerHTML = `<div class="my-card-header">
  <img
    src="../../public/images/img-profile01.png"
    alt="profile_img"
    class="profile_img"
  />
  <div class="my-card-intro">
    <p class="card-name">${name}</p>
    <p class="card-email">${email}</p>
  </div>
</div>

<div class="my-card-content">
  ${introduce}
</div>`;
}

getUserPortfolio();

const portfolioSection = [
  { className: "education", title: "학력" },
  { className: "awards", title: "수상이력" },
  { className: "certificate", title: "자격증" },
  { className: "projects", title: "프로젝트" },
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

  const userInfoDiv = document.createElement("div");
  userInfoDiv.className = "user-info";
  section.appendChild(userInfoDiv);

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

{
  /* 
<div class="section education">
  <div class="title-bar">
    <h3>학력</h3>
  </div>
  <div class="portfolio-section education">

  </div>
  <div class="portfolio-section education">
    <div class="input-info">
    </div>
  </div>
</div> 
*/
}
