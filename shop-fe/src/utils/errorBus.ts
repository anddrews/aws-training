class ErrorBus {
  subscriptions = new Set<(error: Error) => void>();

  setError(error: Error) {
    this.subscriptions.forEach((subscription) => subscription(error));
  }

  subscribe(subscriber: (error: Error) => void) {
    this.subscriptions.add(subscriber);
  }
}

export const errorBus = new ErrorBus();
