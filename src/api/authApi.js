import axios from "axios";
import { backendConfig } from "./config";

export const login = async (userData) => {
  try {
    const response = await axios.post(
      `${backendConfig.serverURL}/api/all/login.php`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.msg || "Something went wrong");
  }
};

export const getInfluencers = async (token) => {
  try {
    const response = await axios.get(
      `${backendConfig.serverURL}/api/admin/getInfluencers.php?token=${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.msg || "Something went wrong");
  }
};

export const getInfluencerInfo = async (userId, token) => {
  try {
    console.log("fds1");
    const response = await axios.get(
      `${backendConfig.serverURL}/api/all/getInfluencerInfo.php?userId=${userId}&token=${token}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.msg || "Something went wrong");
  }
};

export const updateFakeAverageBackend = async (userId, token, fakeAvg) => {
  try {
    console.log(userId, token, fakeAvg);
    const response = await axios.get(
      `${backendConfig.serverURL}/api/admin/updateFakeAverage.php?userId=${userId}&token=${token}&fakeavg=${fakeAvg}`
    );
    return response;
  } catch (error) {
    throw new Error(error.response.data.msg || "Something went wrong");
  }
};

export const createInfluencerWithdraw = async (userId, token) => {
  try {
    console.log(userId, token);
    const response = await axios.get(
      `${backendConfig.serverURL}/api/admin/createInfluencerWithdraw.php?userId=${userId}&token=${token}}`
    );
    return response;
  } catch (error) {
    throw new Error(error.response.data.msg || "Something went wrong");
  }
};

export const getInfluencerWithdrawHistory = async (userId, token) => {
    try {
      const response = await axios.get(
        `${backendConfig.serverURL}/api/all/getInfluencerWithdrawHistory.php?userId=${userId}&token=${token}}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.msg || "Something went wrong");
    }
  };
