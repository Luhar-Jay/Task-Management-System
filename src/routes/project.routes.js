import { Router } from "express";
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js";
import {
  addMemberToProject,
  createProject,
  deleteProject,
  getProjectById,
  getProjectMembers,
  getProjects,
  updateProject,
  updateProjectMembers,
} from "../controllers/project.controllers.js";
const router = Router();

router.route("/all-projects").get(isLoggedIn, getProjects);
router.route("/create-projects").post(isLoggedIn, createProject);
router.route("/projectsby_id/:id").get(isLoggedIn, getProjectById);
router.route("/update_project/:id").put(isLoggedIn, updateProject);
router.route("/delete_project/:id").delete(isLoggedIn, deleteProject);
router
  .route("/project/:projectId/add_member")
  .post(isLoggedIn, addMemberToProject);
router.route("/project/:projectId/members").post(isLoggedIn, getProjectMembers);
router
  .route("/project/:projectId/update_member")
  .post(isLoggedIn, updateProjectMembers);

export default router;
