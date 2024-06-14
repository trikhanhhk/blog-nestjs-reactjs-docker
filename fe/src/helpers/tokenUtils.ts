import { jwtDecode, JwtPayload } from "jwt-decode";
import { refreshTokenExpired, getToken } from "../services/AuthService";

export const startCheckingTokenExpiration = async () => {
  const accessToken = localStorage.getItem('access_token');
  const refreshToken = localStorage.getItem('refresh_token');
  if (accessToken && refreshToken) {
    await checkTokenExpiration(accessToken, refreshToken);
  }

  setInterval(async () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (getToken() && accessToken && refreshToken) {
      await checkTokenExpiration(accessToken, refreshToken);
    }
  }, 1 * 60 * 1000);
};


const checkTokenExpiration = async (accessToken: string, refreshToken: string) => {
  const decodedToken = jwtDecode(accessToken) as JwtPayload;
  try {
    if (decodedToken && decodedToken.exp) {
      const exp = decodedToken.exp;
      const currentTime = Date.now();
      const expirationTime = exp * 1000;
      const timeRemaining = expirationTime - currentTime;

      if (timeRemaining <= 5 * 60 * 1000) {
        await refreshTokenFunction(refreshToken);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const refreshTokenFunction = async (currentRefreshToken: string) => {
  const res = await refreshTokenExpired(currentRefreshToken);

  if (!res) return;

  const { accessToken, refreshToken, userData } = res.data.data;
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  localStorage.setItem("userData", JSON.stringify(userData));
};