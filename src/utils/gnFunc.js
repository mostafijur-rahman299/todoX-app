
export const generateId = (length = 16) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const timestamp = Date.now().toString(36);
    const remainingLength = length - timestamp.length - 1;
    
    for (let i = 0; i < remainingLength; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `${timestamp}-${result}`;
};



