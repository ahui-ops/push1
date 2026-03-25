const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "https://m1.apifoxmock.com/m1/7995529-7749521-default";
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL;

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

function getStoredAccessToken() {
    if (typeof window === "undefined") {
        return null;
    }

    const directTokenKeys = ["access_token", "token", "auth_token"];
    for (const key of directTokenKeys) {
        const value = window.localStorage.getItem(key);
        if (value) {
            return value;
        }
    }

    const jsonTokenKeys = ["auth", "auth_response", "user_session"];
    for (const key of jsonTokenKeys) {
        const rawValue = window.localStorage.getItem(key);
        if (!rawValue) {
            continue;
        }

        try {
            const parsedValue = JSON.parse(rawValue) as { access_token?: string };
            if (parsedValue.access_token) {
                return parsedValue.access_token;
            }
        } catch {
            continue;
        }
    }

    return null;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = new Headers(init?.headers);
    headers.set("Accept", "application/json");

    const token = getStoredAccessToken();
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(new URL(path, API_BASE_URL), {
        ...init,
        headers,
        credentials: "include",
    });

    if (!response.ok) {
        let message = `${response.status} ${response.statusText}`;

        try {
            const errorBody = (await response.json()) as { detail?: string };
            if (typeof errorBody.detail === "string" && errorBody.detail.length > 0) {
                message = errorBody.detail;
            }
        } catch {
            // Keep the default HTTP status text when the body is not JSON.
        }

        throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
        return undefined as T;
    }

    return (await response.json()) as T;
}

export function get<T>(path: string) {
    return request<T>(path, { method: "GET" });
}

export function post<TResponse = void>(path: string, body?: unknown) {
    return request<TResponse>(path, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });
}

export function patch<TResponse = void>(path: string, body: unknown) {
    return request<TResponse>(path, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });
}

export function del<TResponse = void>(path: string) {
    return request<TResponse>(path, { method: "DELETE" });
}

export function buildWebSocketUrl(userId: number) {
    if (WS_BASE_URL) {
        const url = new URL(WS_BASE_URL);
        url.searchParams.set("user_id", String(userId));
        return url.toString();
    }

    const url = new URL(API_BASE_URL);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = "/ws";
    url.searchParams.set("user_id", String(userId));
    return url.toString();
}
