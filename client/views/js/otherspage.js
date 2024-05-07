const portfolio = document.querySelector(".resume-content");

const portfolioSection = [
  { className: "education", title: "학력" },
  { className: "awards", title: "수상이력" },
  { className: "certificate", title: "자격증" },
  { className: "projects", title: "프로젝트" },
];

for (let i = 0; i < portfolioSection.length; i++) {
  const eachSection = portfolioSection[i];

  const newSection = document.createElement("div");
  newSection.className = "section";
  newSection.classList.add(eachSection.className);

  const header = document.createElement("div");
  header.className = "title-bar";

  const title = document.createElement("h3");
  title.innerText = eachSection.title;

  const addNewItemBtn = document.createElement("button");
  addNewItemBtn.innerText = "+ 추가";

  header.appendChild(title);
  header.appendChild(addNewItemBtn);
  newSection.appendChild(header);
  portfolio.appendChild(newSection);
}

const modifiedButton = querySelector("button");
