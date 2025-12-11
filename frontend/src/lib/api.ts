const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Bir hata oluştu");
    }

    return data;
}

// Auth endpoints
export const authApi = {
    
    register: (data: { name: string; email: string; password: string }) =>
        apiRequest("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    login: (data: { email: string; password: string }) =>
        apiRequest("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
        }),
};
