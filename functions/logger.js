function log(level, message) {
    const date = new Date();
    const timestamp = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    switch (level) {
        case levels.debug:
            console.log(`\x1b[36m[${timestamp}] [${level}] ${message}\x1b[0m`);
            break;
        case levels.info:
            console.log(`\x1b[32m[${timestamp}] [${level}] ${message}\x1b[0m`);
            break;
        case levels.warn:
            console.log(`\x1b[33m[${timestamp}] [${level}] ${message}\x1b[0m`);
            break;
        case levels.error:
            console.log(`\x1b[31m[${timestamp}] [${level}] ${message}\x1b[0m`);
            break;
    }
}

const levels = {
    debug: 'DEBUG',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR'
}

const debug = (message) => log(levels.debug, message);
const info = (message) => log(levels.info, message);
const warn = (message) => log(levels.warn, message);
const error = (message) => log(levels.error, message);

module.exports = {
    debug,
    info,
    warn,
    error
}