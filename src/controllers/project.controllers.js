const getProjects = asyncHandler(async (req, res) => {});
const getProjectById = asyncHandler(async (req, res) => {});
const createProject = asyncHandler(async (req, res) => {});
const updateProject = asyncHandler(async (req, res) => {});
const deleteProject = asyncHandler(async (req, res) => {});
const addMemberToProject = asyncHandler(async (req, res) => {});
const getProjectMembers = asyncHandler(async (req, res) => {});
const updateProjectMembers = asyncHandler(async (req, res) => {});
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
