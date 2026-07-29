import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { apiClient, isUnauthorizedError } from "@/lib/api/client";
import type { ApiSuccess, LoginInput, RegisterInput, User } from "@/types/api";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiClient.get<ApiSuccess<{ user: User }>>(
      API_ENDPOINTS.auth.currentUser,
    );

    return response.data.data.user;
  } catch (error) {
    if (isUnauthorizedError(error)) {
      return null;
    }

    throw error;
  }
}

export async function registerUser(input: RegisterInput): Promise<User> {
  const response = await apiClient.post<ApiSuccess<{ user: User }>>(
    API_ENDPOINTS.auth.register,
    input,
  );

  return response.data.data.user;
}

export async function loginUser(input: LoginInput): Promise<User> {
  const response = await apiClient.post<ApiSuccess<{ user: User }>>(
    API_ENDPOINTS.auth.login,
    input,
  );

  return response.data.data.user;
}

export async function logoutUser(): Promise<void> {
  await apiClient.post<ApiSuccess<null>>(API_ENDPOINTS.auth.logout);
}
