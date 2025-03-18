
export const generateId = (length = 16) => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, length - timestamp.length);
    return `${timestamp}-${randomStr}`;
};



