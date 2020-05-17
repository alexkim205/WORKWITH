class FormError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FormError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack
    };
  }
}

export default FormError;
