// ============================================================================
// Async Task Scheduler
// Ensures sequential execution of async tasks with error recovery
// ============================================================================

/**
 * AsyncTaskScheduler - Queue-based scheduler for sequential task execution
 *
 * Features:
 * - Ensures only one task runs at a time
 * - Handles errors gracefully - failed tasks don't stop the queue
 * - Supports clearing all pending tasks
 * - Returns promises for each enqueued task
 */
class AsyncTaskScheduler {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  /**
   * Add a task to the queue and process it
   * @param {Function} taskFn - Async function to execute
   * @returns {Promise} - Resolves when task completes
   */
  async enqueue(taskFn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ taskFn, resolve, reject });
      this.processQueue();
    });
  }

  /**
   * Process the queue sequentially
   */
  async processQueue() {
    // If already processing, return
    if (this.isProcessing) {
      return;
    }

    // If queue is empty, return
    if (this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const { taskFn, resolve, reject } = this.queue.shift();

      try {
        const result = await taskFn();
        resolve(result);
      } catch (error) {
        console.error('Task failed in scheduler:', error);
        reject(error);
        // Continue processing the rest of the queue despite the error
      }
    }

    this.isProcessing = false;
  }

  /**
   * Clear all pending tasks
   */
  clear() {
    // Reject all pending tasks
    while (this.queue.length > 0) {
      const { reject } = this.queue.shift();
      reject(new Error('Queue cleared'));
    }
  }

  /**
   * Get queue size
   * @returns {number} - Number of pending tasks
   */
  get size() {
    return this.queue.length;
  }

  /**
   * Check if scheduler is currently processing
   * @returns {boolean}
   */
  get busy() {
    return this.isProcessing;
  }
}

// ============================================================================
// Export
// ============================================================================

window.AsyncTaskScheduler = AsyncTaskScheduler;
