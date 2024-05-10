import {
  getUserInfo,
  getFormInfo,
  createNewForm,
  updateForm,
  updateProfile,
  verifyAndUpdatePassword,
  verifyAndDeleteUser,
} from "./apiService.js";

import {
  createBtns,
  createInput,
  createDateInput,
  createSkills,
  toggleInputs,
  isStrongPassword,
  passwordsMatch,
} from "./utils.js";

// 포폴 섹션 - 학력, 수상이력, 자격증, 플젝
const portfolioSection = [
  { className: "education", title: "학력" },
  { className: "award", title: "수상이력" },
  { className: "certificate", title: "자격증" },
  { className: "project", title: "프로젝트" },
];

// 백엔드로 보낼 날짜 포멧해주는 함수
function getFormattedDate(section, dateInputs) {
  const { startYear, startMonth, endYear, endMonth } = dateInputs;

  const start = `${startYear.value}.${startMonth.value}`;

  if (section === "award" || section === "certificate") {
    return start;
  }
  const end = `${endYear.value}.${endMonth.value}`;
  return `${start} - ${end}`;
}

// 학력, 상, 자격증, 플젝
// 각 섹션의 인풋 폼 만들어 주는 함수
function createSectionForm(section, data = null) {
  const sectionContainer = document.createElement("div");
  sectionContainer.className = `portfolio-section ${section}`;

  const sectionInput = document.createElement("form");
  sectionInput.className = `item ${section}`;

  const inputInfo = document.createElement("div");
  inputInfo.className = "input-info";
  sectionInput.appendChild(inputInfo);

  let date;
  if (!data) {
    date = createDateInput(section);

    // 받아와야 하는 정보가 있다면 섹션별로 날짜 부분 따로 만들어주는 함수
  } else {
    if (section === "education" || section === "project") {
      date = createDateInput(section, data.periodStart, data.periodEnd);
    } else if (section === "award") {
      date = createDateInput(section, data.awardDate);
    } else {
      date = createDateInput(section, data.licenseDate);
    }
    sectionInput.setAttribute("formId", data._id);
  }

  // 수정, 삭제, 확인 버튼도 불러와야 하는 데이터가 있으면 수정만 가능하게 설정
  // 불러와야 하는 데이터가 없으면 post할 수 있게 해줌
  const btnContainer = !data
    ? createBtns(sectionInput, section)
    : createBtns(sectionInput, section, true);
  sectionInput.appendChild(btnContainer);

  // 학력은 학교명, 전공 및 학위, 날짜 인풋 받음
  // 불러와야 하는 데이타가 있으면 값 전달
  if (section === "education") {
    let schoolName = !data
      ? createInput("school-name", "학교명")
      : createInput("school-name", "학교명", true, data.school);
    const major = !data
      ? createInput("major", "전공 및 학위 (ex. 경영학과 학사)")
      : createInput(
          "major",
          "전공 및 학위 (ex. 경영학과 학사)",
          true,
          data.major
        );
    inputInfo.appendChild(schoolName);
    inputInfo.appendChild(major);
    inputInfo.appendChild(date);
    if (data) toggleInputs(inputInfo, true);

    // 프로젝트는 프로젝트명, 링크 (선택), 날짜, 프로젝트 개요 타이틀 (ex. OOO를 하는 서비스입니다),
    // 프로젝트 상세 설명, 스킬태그 값 받음
    // 불러와야 하는 데이타가 있으면 값 전달
  } else if (section === "project") {
    const projName = !data
      ? createInput("proj-name", "프로젝트명")
      : createInput("proj-name", "프로젝트명", true, data.contentTitle);

    const link = !data
      ? createInput("proj-link", "https://example.com (선택)")
      : createInput("proj-link", "https://example.com (선택)", true, data.link);

    const contentTitle = document.createElement("input");
    contentTitle.placeholder = "프로젝트를 간략하게 요약해주세요";
    contentTitle.name = "name";
    if (data) {
      contentTitle.value = data.name;
    }

    const details = document.createElement("textarea");
    details.placeholder = "프로젝트 상세설명";
    if (data) {
      const textVal = data.contentDetail.join("\n");
      details.textContent = textVal;
    }

    // 사용자가 쓰는 만큼 textarea가 늘어나거나 줄어들게 하는 함수
    details.addEventListener("input", function () {
      details.style.height = "auto";
      details.style.height = `${details.scrollHeight}px`;
    });

    // 스킬 부분에 사용자가 스킬 입력하면 칩 만들어줌
    // ex. react.js 치고 엔터 -> 칩 생성
    const chipset = document.createElement("md-chip-set");
    chipset.className = "chipset";
    const skills = createSkills(chipset);

    // 스킬 부분 데이타가 있으면 불러와주는 함수
    if (data && data.techStack.length !== 0) {
      data.techStack.forEach((s) => {
        const skill = document.createElement("md-input-chip");
        skill.className = "skill";
        skill.label = s;
        chipset.appendChild(skill);
        // callChip();
      });
    }

    inputInfo.appendChild(projName);
    inputInfo.appendChild(link);
    inputInfo.appendChild(date);
    inputInfo.appendChild(contentTitle);
    inputInfo.appendChild(details);
    inputInfo.appendChild(skills);
    inputInfo.appendChild(chipset);
    if (data) toggleInputs(inputInfo, true);

    // 수상이력, 자격증 섹션은 받아야 할 정보가 유사함
    // 날짜, 수상명, 발급 기관만 받으면 됨
    // 불러와야 할 정보가 있으면 정보 불러오기
  } else {
    inputInfo.appendChild(date);

    const details = document.createElement("div");
    details.className = `details ${section}`;

    const placeholder = section === "award" ? "수상명" : "자격명";
    const name = !data
      ? createInput("name", placeholder)
      : createInput("name", placeholder, true, data.name);
    details.appendChild(name);

    const institution = !data
      ? createInput("institution-name", "발급 기관")
      : createInput("institution-name", "발급 기관", true, data.agency);
    details.appendChild(institution);

    inputInfo.appendChild(details);
    if (data) toggleInputs(inputInfo, true);
  }

  sectionContainer.appendChild(sectionInput);

  sectionInput.addEventListener("submit", (event) =>
    handleSubmit(event, sectionInput, btnContainer, section)
  );
  return sectionContainer;
}

// 박스랑 제목, 추가 버튼 그려주는 함수
function createSection(sectionData) {
  const section = document.createElement("div");
  section.className = "section";
  section.classList.add(sectionData.className);

  const header = document.createElement("div");
  header.className = "title-bar";

  const title = document.createElement("h3");
  title.innerText = sectionData.title;
  header.appendChild(title);

  const addNewItemBtn = document.createElement("button");
  addNewItemBtn.innerText = "+ 추가";
  addNewItemBtn.addEventListener("click", async () => {
    const newForm = createSectionForm(sectionData.className);
    section.insertBefore(newForm, section.children[1]);
  });
  header.appendChild(addNewItemBtn);
  section.appendChild(header);

  return section;
}

function deleteUser() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  const delUser = document.querySelector(".delete-user");

  delUser.onclick = () => {
    const modal = new bootstrap.Modal(document.getElementById("delete-user"));
    modal.show();

    const input = modal._element.querySelector(".input-container");
    const showBtn = input.querySelector("button");
    showBtn.onclick = () => {
      if (showBtn.innerText === "Show") {
        showBtn.innerText = "Hide";
        const i = showBtn.parentElement.parentElement.querySelector("input");
        i.setAttribute("type", "text");
      } else {
        showBtn.innerText = "Show";
        const i = showBtn.parentElement.parentElement.querySelector("input");
        i.setAttribute("type", "password");
      }
    };

    let currentPassword;
    const currPw = document.querySelector("#curr-password");

    const confirmButton = modal._element.querySelector(".btn.btn-primary");
    confirmButton.addEventListener(
      "click",
      function () {
        currentPassword = currPw.value;
        verifyAndDeleteUser(userId, currentPassword).catch((err) => {
          console.log("err:", err);
          alert("입력하신 비밀번호가 올바르지 않습니다");
        });
        currPw.value = "";

        modal.hide();
        showPopupMsg("회원탈퇴", true);
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userId");
        window.location.href = `/signIn`;
      },
      { once: true }
    );

    const closeBtn = modal._element.querySelector(".btn.btn-secondary");
    closeBtn.addEventListener(
      "click",
      () => {
        modal.hide();
      },
      { once: true }
    );
  };
}
deleteUser();

// 비밀번호 업데이트 해주는 함수
function updatePassword() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  const updatepw = document.querySelector(".update-password");

  updatepw.onclick = () => {
    const modal = new bootstrap.Modal(document.getElementById("update-pw"));
    modal.show();

    const inputs = modal._element.querySelectorAll(".input-container");
    inputs.forEach((input) => {
      const showBtn = input.querySelector("button");
      showBtn.onclick = () => {
        if (showBtn.innerText === "Show") {
          showBtn.innerText = "Hide";
          const i = showBtn.parentElement.parentElement.querySelector("input");
          i.setAttribute("type", "text");
        } else {
          showBtn.innerText = "Show";
          const i = showBtn.parentElement.parentElement.querySelector("input");
          i.setAttribute("type", "password");
        }
      };
    });

    const currPw = document.querySelector("#current-password");
    const newPw = document.querySelector("#new-password");
    const confirmNewPw = document.querySelector("#confirm-new-password");

    let currPassword, newPassword, confirmNewPassword;
    // 실패 메시지 정보 가져오기 (비밀번호 불일치)
    const mismatchMessage = document.querySelector(".mismatch-message");
    // 실패 메시지 정보 가져오기 (8글자 이상, 영문, 숫자, 특수문자 미사용)
    const strongPasswordMessage = document.querySelector(
      ".strongPassword-message"
    );

    newPw.onkeyup = function () {
      if (newPw.value.length !== 0) {
        if (isStrongPassword(newPw.value)) {
          strongPasswordMessage.classList.add("hide"); //실패 메시지 숨김
        } else {
          strongPasswordMessage.classList.remove("hide");
        }
      }
    };

    confirmNewPw.onkeyup = function () {
      if (confirmNewPw.value.length !== 0) {
        if (
          passwordsMatch(newPw.value, confirmNewPw.value) &&
          isStrongPassword(newPw.value)
        ) {
          mismatchMessage.classList.add("hide");
        } else {
          mismatchMessage.classList.remove("hide");
        }
      }
    };

    const confirmButton = modal._element.querySelector(".btn.btn-primary");
    confirmButton.addEventListener(
      "click",
      function () {
        currPassword = currPw.value;
        newPassword = newPw.value;
        confirmNewPassword = confirmNewPw.value;

        verifyAndUpdatePassword(userId, currPassword, newPassword).catch(
          (err) => {
            console.log("err:", err);
            alert("입력하신 현재 비밀번호가 올바르지 않습니다");
          }
        );
        currPw.value = "";
        newPw.value = "";
        confirmNewPw.value = "";

        modal.hide();
        showPopupMsg("비밀번호", true);
      },
      { once: true }
    );

    const closeBtn = modal._element.querySelector(".btn.btn-secondary");
    closeBtn.addEventListener(
      "click",
      () => {
        modal.hide();
      },
      { once: true }
    );
  };
}
updatePassword();

// 유저가 새로운 폼을 추가하거나 수정할때 추가/수정되었다고 팝업 메세지 알림 주는 함수
function showPopupMsg(section, isUpdate) {
  let delUser = false;

  let sectionName;
  if (section === "education") {
    sectionName = "학력이";
  } else if (section === "certificate") {
    sectionName = "자격증이";
  } else if (section === "award") {
    sectionName = "수상이력이";
  } else if (section === "project") {
    sectionName = "프로젝트가";
  } else if (section === "프로필") {
    sectionName = `${section}이`;
  } else if (section === "비밀번호") {
    sectionName = `${section}가`;
  } else {
    sectionName = `${section}가`;
    delUser = true;
  }

  const msgToBeDisplayed = document.querySelector("#pop-up");

  // isUpdate이 string value로도 들어오기 때문에 둘 다 체크
  if (isUpdate === true || isUpdate === "true") {
    if (delUser) {
      msgToBeDisplayed.innerText = `${sectionName} 완료되었습니다`;
    } else {
      msgToBeDisplayed.innerText = `${sectionName} 수정되었습니다`;
    }
  } else {
    msgToBeDisplayed.innerText = `${sectionName} 추가되었습니다`;
  }

  msgToBeDisplayed.classList.add("active");
  setTimeout(function () {
    msgToBeDisplayed.classList.remove("active");
  }, 1000);
}

// 사용자가 입력 정보를 저장할때 필수 항목 체크하고 정보 백엔드로 보내는 함수
async function handleSubmit(event, form, buttons, section) {
  event.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  // 사용자가 폼에 필요한 정보를 다 입력했는지 확인
  // 만약 필수 정보를 작성하지 않았다면 submit 안되게 막음
  if (!form.checkValidity()) {
    alert("모든 필수 입력 필드를 작성해주세요.");
    return;
  }

  // 필요한 정보를 다 입력했으면 submit 버튼을 눌렀을때
  // 확인 버튼을 숨기고 편집 버튼 보여주기
  const [submitBtn, editBtn] = buttons.children;
  let isUpdate = submitBtn.getAttribute("update");
  showPopupMsg(section, isUpdate);
  editBtn.classList.toggle("hide");
  submitBtn.classList.toggle("hide");
  toggleInputs(form, true);

  // 저장 하려고 하는 해당 폼의 인풋 정보 불러오기
  // 백엔드로 보낼 수 있게 날짜 포멧 가공
  const sectionInput = event.target;
  const dateInputs = {
    startYear: sectionInput.querySelector('input[name="startYear"]'),
    startMonth: sectionInput.querySelector('input[name="startMonth"]'),
    endYear: sectionInput.querySelector('input[name="endYear"]'),
    endMonth: sectionInput.querySelector('input[name="endMonth"]'),
  };
  const formattedDate = getFormattedDate(section, dateInputs);

  let data = null;
  console.log("section:", section);

  // 섹션 별로 보내야 하는 데이터 가공
  if (section === "education") {
    const schoolName = sectionInput.querySelector(
      'input[name="school-name"]'
    ).value;
    const major = sectionInput.querySelector('input[name="major"]').value;

    data = {
      school: schoolName,
      major,
      periodStart: formattedDate.split(" - ")[0],
      periodEnd: formattedDate.split(" - ")[1],
    };
    console.log("학력 데이터:", data);
  } else if (section === "certificate") {
    const name = sectionInput.querySelector('input[name="name"]').value;
    const agency = sectionInput.querySelector(
      'input[name="institution-name"]'
    ).value;
    data = {
      name,
      agency,
      licenseDate: formattedDate,
    };
    console.log("자격증 데이터:", data);
  } else if (section === "award") {
    const name = sectionInput.querySelector('input[name="name"]').value;
    const agency = sectionInput.querySelector(
      'input[name="institution-name"]'
    ).value;
    data = {
      name,
      agency,
      awardDate: formattedDate,
    };
    console.log("수상 데이터:", data);

    // 프로젝트 섹션
  } else {
    const contentTitle = sectionInput.querySelector(
      'input[name="proj-name"]'
    ).value;
    const link =
      sectionInput.querySelector('input[name="proj-link"]').value || "";
    const name = sectionInput.querySelector('input[name="name"]').value;
    const contentDetail = sectionInput.querySelector("textarea").value;
    const chipset = sectionInput.querySelector(".chipset");
    const skills = Array.from(chipset.children);
    const techStack = skills.map(function (element) {
      return element.label;
    });

    data = {
      contentDetail,
      contentTitle,
      link,
      name,
      periodStart: formattedDate.split(" - ")[0],
      periodEnd: formattedDate.split(" - ")[1],
      techStack,
    };
    console.log("프로젝트 데이터:", data);
  }

  // 처음 섭밋하는 거면 post로 보내줌
  if (submitBtn.getAttribute("update") == "false") {
    createNewForm(userId, section, data)
      .then((res) => {
        return getFormInfo(userId, section);
      })
      .then((newForm) => {
        // attribute로 폼 아이디 바로 업데이트 해주기
        // 나중에 삭제하거나 편집할때 폼 식별 가능하게 해주는 함수
        const idx = newForm.length - 1;
        console.log("newFormId:", newForm[idx]._id);
        sectionInput.setAttribute("formId", newForm[idx]._id);
      })
      .catch((err) => {
        console.log("err:", err);
      });
    // 포스트 끝나면 이후에는 편집(patch)만 가능
    submitBtn.setAttribute("update", true);

    // 정보 업데이트 하기
  } else {
    // 들고 온 정보에서 폼 아이디 받아서 patch로 보내줌
    let formId = form.getAttribute("formid");
    updateForm(section, formId, data).catch((err) => {
      console.log("err:", err);
    });
  }
}

// 각 섹션 토대를 업데이트 해주는 함수 (박스, 제목, 추가 버튼)
function updatePortfolioSections() {
  const portfolio = document.querySelector(".resume-content");

  portfolioSection.forEach((section) => {
    const newSection = createSection(section);
    portfolio.appendChild(newSection);
  });
}

//프로필 자기소개 부분 인풋
// 사용자가 입력할때마다 얼마만큼 남았는지 보여주는 함수
// 영어, 한국어, 글자마다 부피가 달라서 여러번 테스트 해보다가 일단 100으로 설정함
let textarea = document.querySelector(".my-card-content textarea");
textarea.addEventListener("input", function () {
  const wordLimit = document.querySelector(".word-limit");
  const currLength = textarea.value.length;
  wordLimit.innerText = `${currLength}/100`;
});

// 저음 화면이 로딩할때 저장 된 정보가 있으면 get으로 각 섹션별로 정보 불러오는 함수
function loadEachSecInfo(sectionName, sectionInfo) {
  const sectionContainer = document.querySelector(`.section.${sectionName}`);

  // 저장된 정보가 있으면 정보 불러와서 화면에 그려줌
  if (sectionInfo.length > 0) {
    sectionInfo.reverse();
    sectionInfo.forEach((data) => {
      if (!data.isDeleted) {
        const newForm = createSectionForm(sectionName, data);
        sectionContainer.appendChild(newForm);
      }
    });

    // 저장된 정보가 없으면 인풋 폼 생성
  } else {
    const sectionForm = createSectionForm(sectionName);
    sectionContainer.appendChild(sectionForm);
  }
}

// 프로필 텍스트 업데이트 해주는 함수
function renderProfile() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");
  const profileContainer = document.querySelector(".my-card-content");
  const textBox = profileContainer.querySelector("#profile-text");

  profileContainer.addEventListener("submit", (event) => {
    event.preventDefault();
    const textContent = textBox.value;

    updateProfile(userId, textContent)
      .then(() => showPopupMsg("프로필", true))
      .catch((err) => {
        console.log("err:", err);
      });
  });
}

// 유저 정보 불러와서 화면에 그리는 함수
async function displayUserInfo() {
  const params = new URLSearchParams(window.location.search);
  const userId = params.get("userId");

  // 내 상세 정보 가져오기
  const { user, education, award, certificate, project } = await getUserInfo(
    userId
  );
  console.log(user);

  // 프로필 업데이트
  const { email, introduce, name } = user[0];

  const myName = document.querySelector(".card-name");
  myName.innerText = name;
  const myEmail = document.querySelector(".card-email");
  myEmail.innerText = email;
  const myProfileText = document.querySelector("#profile-text");
  myProfileText.value = introduce;
  renderProfile();

  // 각 섹션 정보 불러오기
  let sections = {
    education: education,
    award: award,
    certificate: certificate,
    project: project,
  };

  for (let sectionName in sections) {
    loadEachSecInfo(sectionName, sections[sectionName]);
  }
}

updatePortfolioSections();
displayUserInfo();
