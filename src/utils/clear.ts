/**
 * Clear
 */
function clear(): void {
  process.stdout.write('\x1b[2J');
  process.stdout.write('\x1b[0f');
}

// DEFAULT EXPORT
export default clear;
