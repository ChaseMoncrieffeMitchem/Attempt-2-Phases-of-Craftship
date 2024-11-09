// import { createLogger, transports, format } from 'winston';

// export const logger = createLogger({
//   level: 'error', // Log only info and above (info, warn, error)
//   format: format.combine(
//     format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
//     format.printf(({ timestamp, level, message, ...meta }) => {
//       return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
//     })
//   ),
//   transports: [
//     new transports.Console(),
//     // Add other transports if needed, e.g., file transport
//     // new transports.File({ filename: 'app.log' }),
//   ],
// });
