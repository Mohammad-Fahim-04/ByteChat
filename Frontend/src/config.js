// Centralized API URL for frontend API calls
const rawApiUrl = import.meta.env.VITE_API_URL || "https://bytechat-xw3w.onrender.com";
export const API_URL = rawApiUrl.replace(/\/$/, "");
