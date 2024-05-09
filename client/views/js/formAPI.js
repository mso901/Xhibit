// 베이스 url 설정
const BASE_URL = "http://kdt-ai-10-team04.elicecoding.com/";

const baseInstance = await axios.create({
  baseURL: BASE_URL, // 기본 URL 설정
});

// 학력 가져오기
export const getFormInfo = async (userId, section) => {
  try {
    const response = await baseInstance.get(
      `${BASE_URL}/api/${section}/${userId}`
    );
    return response.data;
  } catch (err) {
    console.error(`${section} 가져오는데 실패`, err);
    throw err;
  }
};

export const getInfo = async (userId, section) => {
  try {
    const response = await baseInstance.get(`/api/${userId}`);
    // 유저 상세 정보 전부 선언
    const { user, education, award, certificate, project } = response.data;
    return { user, education, award, certificate, project };
  } catch (err) {
    console.error(`${section} 가져오는데 실패`, err);
    throw err;
  }
};

// 학력 업데이트
export const updateForm = async (section, formId, formData) => {
  try {
    const response = await baseInstance.patch(
      `${BASE_URL}/api/${section}/${formId}`,
      formData
    );
    return response.data;
  } catch (err) {
    console.error("업데이트 실패:", err);
    throw err;
  }
};

// 학력 지우기
export const deleteForm = async (section, formId) => {
  try {
    const response = await baseInstance.delete(
      `${BASE_URL}/api/${section}/${formId}`
    );
    return response.data;
  } catch (err) {
    console.error(`${section} 삭제 실패:`, err);
    throw err;
  }
};

// 학력 생성
export const createNewForm = async (userId, section, newData) => {
  try {
    const response = await baseInstance.post(
      `${BASE_URL}/api/${section}/${userId}`,
      newData
    );
    return response.data;
  } catch (error) {
    console.error(`${section} 생성 실패:`, error);
    throw error;
  }
};

export const updateProfile = async (userId, newData) => {
  try {
    const response = await baseInstance.patch(
      `${BASE_URL}/api/changeIntroduce/${userId}`,
      { newIntroduce: newData }
    );
    return response.data;
  } catch (error) {
    console.error(`profile text 업데이트 실패:`, error);
    throw error;
  }
};

export const getUserInfo = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch user information:`, error);
    throw error;
  }
};
