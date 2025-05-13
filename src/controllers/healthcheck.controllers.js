import { ApiResponse } from "../utils/api-response.js";

const healthCheck = async (req, res) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, { message: "Server is running" }));
  } catch (error) {
    console.log(error);
  }
};

export { healthCheck };
