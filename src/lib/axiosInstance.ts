import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_URL, // Replace with your API base URL
  headers: { "Content-Type": "application/json" },
});

/**
 * Gets the 'NEXT_LOCALE' cookie value from the browser.
 */
function getLocaleFromCookie() {
  if (typeof document === "undefined") return null;
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];

  return cookieValue || null;
}

// Add a request interceptor
axiosInstance.interceptors.request.use(
  async function (config) {
    let tenantId = null;
    let locale = null;

    if (typeof window !== "undefined") {
      // --- Client-Side ---
      tenantId = window.location.host;
      locale = getLocaleFromCookie();
    } else {
      // --- Server-Side ---

      // 1. Get Tenant
      const { headers } = await import("next/headers");
      const headersList = headers();
      tenantId = headersList.get("X-Forwarded-Host");

      // 2. Get Locale (from next-intl)
      try {
        const { getLocale } = await import("next-intl/server");
        locale = await getLocale();
      } catch (e) {
        console.error("Could not get server-side locale for interceptor", e);
      }
    }

    // --- Set Tenant-Id Header ---
    if (tenantId) {
      if (tenantId.includes("localhost")) {
        config.headers["Tenant-Id"] = "https://homesync.ro";
      } else {
        if (tenantId.includes("https://")) {
          config.headers["Tenant-Id"] = tenantId;
        } else {
          config.headers["Tenant-Id"] = "https://" + tenantId;
        }
      }
    }

    if (locale) {
      config.headers["lang"] = locale;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default axiosInstance;