export interface CustomApiResponse<T> {
    requestId: string;
    timestamp: string;
    action: string;
    success: boolean;
    message?: string | undefined;
    data?: T;
    errorCode?: string | undefined;
    path: string;
    method: string;
    executionTime: number;
}