const API_BASE_URL = "http://localhost:3000";

// 학력 가져오기
export const getEducations = async (userId) => {
	try {
		const response = await axios.get(`${API_BASE_URL}/${userId}`);
		console.log(response);
		return response.data;
	} catch (err) {
		console.error("학력 가져오는데 실패", err);
		throw err;
	}
};

// 학력 업데이트
export const updateEducation = async (userId, educationData) => {
	try {
		const response = await axios.put(
			`${API_BASE_URL}/${userId}`,
			educationData
		);
		return response.data;
	} catch (err) {
		console.error("학력 업데이트 실패:", err);
		throw err;
	}
};

// 학력 지우기
export const deleteEducation = async (educationId) => {
	try {
		const response = await axios.delete(`${API_BASE_URL}/${educationId}`);
		return response.data;
	} catch (err) {
		console.error("학력 삭제 실패:", err);
		throw err;
	}
};

// 학력 생성
export const createEducation = async (userId, educationData) => {
	try {
		const response = await axios.post(
			`${API_BASE_URL}/api/education`,
			educationData
		);
		return response.data;
	} catch (err) {
		console.error("학력 생성하는데 오류가 발생했습니다:", err);
		throw err;
	}
};
