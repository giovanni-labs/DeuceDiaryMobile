const listeners: Array<(event: { url: string }) => void> = [];

export function parse(url: string) {
  try {
    // Simple parse for testing: extract path from URL
    const u = new URL(url.replace("deucediary://", "https://deucediary.app/"));
    return {
      path: u.pathname.replace(/^\//, ""),
      queryParams: Object.fromEntries(u.searchParams),
    };
  } catch {
    return { path: null, queryParams: {} };
  }
}

export function getInitialURL() {
  return Promise.resolve(null);
}

export function addEventListener(
  _type: string,
  callback: (event: { url: string }) => void
) {
  listeners.push(callback);
  return {
    remove: () => {
      const idx = listeners.indexOf(callback);
      if (idx >= 0) listeners.splice(idx, 1);
    },
  };
}

export function createURL(path: string) {
  return `deucediary://${path}`;
}

// Test helper
export function __simulateURL(url: string) {
  listeners.forEach((cb) => cb({ url }));
}
