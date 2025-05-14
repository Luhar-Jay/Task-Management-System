import mongoose from "mongoose";
import { Project } from "../models/project.models.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";

const createProject = asyncHandler(async (req, res) => {
  const { projectName, description } = req.body;
  if (!projectName) {
    res.status(400).json({
      message: "Name is required",
    });
  }

  try {
    const project = await Project.insertMany({
      projectName,
      description,
      createdBy: req.user._id,
    });

    console.log(project);

    res.status(200).json({
      success: true,
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Create project failed",
      success: false,
      error: error.message,
    });
  }
});

const getProjects = asyncHandler(async (req, res) => {
  try {
    const project = await Project.find();
    return res.status(200).json({
      success: true,
      message: "Projects fetched successfully",
      project,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Can not find projects",
      success: false,
      error: error.message,
    });
  }
});

const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("ID FOR PROJECT", id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({
      message: "Invalid ObjectId",
    });
  }

  try {
    const project = await Project.findById(id).populate(
      "createdBy",
      "username email",
    );

    console.log(project);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      message: "fetched project failed by id",
      success: false,
      error: error.message,
    });
  }
});

const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { projectName, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
  }

  try {
    const project = await Project.findByIdAndUpdate(id, {
      projectName,
      description,
    });
    if (!project) {
      throw new ApiResponse(401, "Project fatched fail");
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    throw new ApiError(400, "Project update fail");
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Project ID: ", id);

  try {
    const project = await Project.findByIdAndDelete(id).populate(
      "createdBy",
      "username email",
    );
    console.log(project);

    // await Project.findByIdAndDelete(id);
    if (!project) {
      throw new ApiError(401, "Project not found");
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    console.log(error.message);

    throw new ApiError(401, "Delete failed");
  }
});

const addMemberToProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { member: memberId } = req.body;
  console.log("projectId", projectId);
  console.log("memberId", memberId);

  const loggedInUser = req.user;
  console.log("loggedInUser", loggedInUser);

  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(memberId)
  ) {
    throw new ApiError(400, "MemberId and ProjectId is invalid");
  }

  try {
    const project = await Project.findById(projectId);
    console.log(project);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    if (project.member.includes(memberId)) {
      throw new ApiResponse(400, "Member is already exist");
    }

    project.member.push(memberId);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Member add successfully",
    });
  } catch (error) {
    console.log(error.message);

    throw new ApiError(401, "Member add failed", { success: false });
  }
});

const getProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  console.log("projectID", projectId);

  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    throw new ApiError(401, "ProjectId not found");
  }

  try {
    const project = await Project.findById(projectId).populate(
      "member",
      "username email fullname",
    );

    if (!project) {
      throw new ApiError(401, "Project member not found");
    }
    return res.status(200).json({
      success: true,
      message: "Fetch all members",
      data: project,
    });
  } catch (error) {
    console.log(error.message);
    throw new ApiError(401, "Member add failed", { success: false });
  }
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { memberIds } = req.body;

  console.log("IDS", projectId, memberIds);

  if (
    !Array.isArray(memberIds) ||
    memberIds.some((id) => !mongoose.Types.ObjectId.isValid(id))
  ) {
    throw new ApiError(400, "One or more member IDs are invalid");
  }

  try {
    const project = await Project.findById(projectId);

    console.log(project);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    project.member = memberIds;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project members updated successfully",
      members: project.member,
    });
  } catch (error) {
    console.log(error.message);
    throw new ApiError(401, "Member update failed");
  }
});

const updateMembersRole = asyncHandler(async (req, res) => {});

const deleteMembersRole = asyncHandler(async (req, res) => {});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteMembersRole,
  deleteProject,
  addMemberToProject,
  getProjectMembers,
  updateMembersRole,
  updateProjectMembers,
};
