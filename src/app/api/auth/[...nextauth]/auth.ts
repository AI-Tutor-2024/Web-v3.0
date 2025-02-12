import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

interface SignInParams {
  email: string;
  providerId: string;
}

interface SignInResponse {
  accessToken: string | null;
  refreshToken: string | null;
}

export async function aiTutorSignIn(
  token: string | null,
  data: SignInParams
): Promise<SignInResponse> {
  try {
    const response = await api.post(`/auth/sign-in`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const accessToken =
      typeof response.data?.information?.accessToken === "string"
        ? response.data.information.accessToken
        : null;

    const refreshToken =
      typeof response.data?.information?.refreshToken === "string"
        ? response.data.information.refreshToken
        : null;

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(error);
    return { accessToken: null, refreshToken: null };
  }
}
