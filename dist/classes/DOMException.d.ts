export declare class DOMException extends Error {
    static readonly INDEX_SIZE_ERR = 1;
    static readonly HIERARCHY_REQUEST_ERR = 3;
    static readonly WRONG_DOCUMENT_ERR = 4;
    static readonly INVALID_CHARACTER_ERR = 5;
    static readonly NOT_FOUND_ERR = 8;
    static readonly NOT_SUPPORTED_ERR = 9;
    static readonly INUSE_ATTRIBUTE_ERR = 10;
    static readonly NAMESPACE_ERR = 14;
    readonly code: number;
    constructor(message: string, name?: string, code?: number);
}
