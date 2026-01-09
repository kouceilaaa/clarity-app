// Server actions
export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  changePassword,
  deleteAccount,
  type AuthResult,
} from "./auth.actions";

export {
  simplifyText,
  simplifyFromUrl,
  getHistory,
  getSimplificationById,
  toggleFavorite,
  deleteSimplification,
  getFavorites,
  type SimplificationResult,
  type HistoryResult,
} from "./simplification.actions";
