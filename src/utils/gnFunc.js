
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

export const randomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
};

export const formatDate = (dateInput) => {
    let date = dateInput;
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    // Check if date is valid after conversion
    if (isNaN(date.getTime())) {
        // console.error('Invalid date provided to formatDate:', dateInput);
        return 'Invalid Date'; // Or handle as per requirement
    }
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};
