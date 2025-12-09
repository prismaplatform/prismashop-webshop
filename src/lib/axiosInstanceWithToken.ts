import axios from "axios";
import Cookies from "js-cookie";

const axiosInstanceWithToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL, // Replace with your API base URL
  headers: { "Content-Type": "application/json" },
});

// Add a request interceptor
axiosInstanceWithToken.interceptors.request.use(
  async function (config) {
    let tenantId = null;

    if (typeof window !== "undefined") {
      // Client-side: use the window location
      tenantId = window.location.host;
    } else {
      // Server-side: dynamically import headers from next/headers
      const { headers } = await import("next/headers");
      const headersList = headers();
      tenantId = headersList.get("X-Forwarded-Host"); // Use correct casing
    }

    // Add the Tenant-Id header if we have the tenantId
    if (tenantId) {
      if (tenantId.includes("localhost")) {
        config.headers["Tenant-Id"] = "https://letrafutar.hu";
      } else {
        config.headers["Tenant-Id"] = "https://" + tenantId;
      }
    }

    // Get the 'auth' cookie and add the Authorization header if it exists
    const authToken = Cookies.get("auth"); // Retrieve the 'auth' cookie
    if (authToken) {
      config.headers["Authorization"] = `${authToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstanceWithToken;
