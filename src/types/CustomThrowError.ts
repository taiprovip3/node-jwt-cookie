export class CustomThrowError extends Error {
    statusCode: number;
    action: string;
    errorCode?: string | undefined;

    constructor(action: string, message: string, statusCode: number, errorCode?: string) {
        super(message);
        this.action = action;
        this.statusCode = statusCode;
        this.errorCode = errorCode;
    }
}