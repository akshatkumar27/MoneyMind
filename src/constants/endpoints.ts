export const API_BASE_URL = 'https://finance-management-service.onrender.com';

export const ENDPOINTS = {
    BASE_URL: API_BASE_URL,
    AUTH: {
        SEND_OTP: `${API_BASE_URL}/api/auth/send-otp`,
        VERIFY_OTP: `${API_BASE_URL}/api/auth/verify-otp`,
        ME: `${API_BASE_URL}/api/auth/me`,
        LOGOUT: `${API_BASE_URL}/api/auth/logout`,
    },
    USER: {
        FINANCIAL_PROFILE: `${API_BASE_URL}/api/user/financial-profile`,
        DELETE: `${API_BASE_URL}/api/user/delete`,
    },
    GOALS: {
        BASE: `${API_BASE_URL}/api/goals`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/goals/${id}`,
    },
    INSIGHTS: {
        BASE: `${API_BASE_URL}/api/insights`,
    },
    CONTRIBUTIONS: {
        BASE: `${API_BASE_URL}/api/contributions`,
        LIST: `${API_BASE_URL}/api/contributions/list`,
        UPDATE: `${API_BASE_URL}/api/contributions/update`,
    },
    NOTIFICATIONS: {
        REGISTER_TOKEN: `${API_BASE_URL}/api/notifications/register-token`,
        UNREGISTER_TOKEN: `${API_BASE_URL}/api/notifications/unregister-token`,
    },
    WAITLIST: {
        JOIN: `${API_BASE_URL}/api/waitlist/join`,
    },
};
