class CancelError extends Error {
  constructor(err) {
    super(err.message);
    this.name = 'CancelError';
    this.message = 'Request cancelled by client.';
  }

  toJSON() {
    return {
      code: this.code,
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }
}

export default CancelError;
