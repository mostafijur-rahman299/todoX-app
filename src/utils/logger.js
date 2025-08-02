/**
 * Environment-aware logging utility
 * Prevents console logs in production builds
 */
class Logger {
    static log(...args) {
        if (__DEV__) {
            console.log(...args);
        }
    }

    static warn(...args) {
        if (__DEV__) {
            console.warn(...args);
        }
    }

    static error(...args) {
        if (__DEV__) {
            console.error(...args);
        }
        // In production, you might want to send to crash reporting
        // crashlytics().log(args.join(' '));
    }

    static info(...args) {
        if (__DEV__) {
            console.info(...args);
        }
    }

    static debug(...args) {
        if (__DEV__) {
            console.debug(...args);
        }
    }
}

export default Logger;