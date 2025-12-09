export const CONFIGURATION_URL = "https://daxxgn860i5ze.cloudfront.net/";

export function getConfigurationUrlWithDomain(domain: string) {
  return CONFIGURATION_URL + domain + "/";
}

export function getConfigurationUrlWithDomainFromLocalStorage() {
  return CONFIGURATION_URL + readDomainFromLocalStorage() + "/";
}

function readDomainFromLocalStorage() {
  return localStorage.getItem("resolvedDomain");
}
