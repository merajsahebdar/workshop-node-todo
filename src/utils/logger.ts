import * as chalk from 'chalk';
import {createLogger, format as LoggerFormat, transports as LoggerTransport} from 'winston';

// Create an instance of logger.
const logger = createLogger({
  format: LoggerFormat.combine(
    LoggerFormat.timestamp(),
    LoggerFormat.printf(({level, message, timestamp}) => {
      const output = [];

      switch (level) {
        case 'info':
          output.push(chalk.bold.cyan('[INFO]'));
          break;
        case 'warn':
          output.push(chalk.bold.yellow('[WARNING]'));
          break;
        case 'error':
          output.push(chalk.bold.red('[ERROR]'));
          break;
        case 'debug':
          output.push(chalk.bold('[DEBUG]'));
          break;
        default:
          output.push(chalk.bold.gray('[LOG]'));
      }

      output.push(`[${timestamp}] ${message}`);

      return output.join('');
    })
  ),
  transports: [new LoggerTransport.Console({debugStdout: true, stderrLevels: ['error', 'warn']})],
});

// DEFAULT EXPORT
export default logger;
