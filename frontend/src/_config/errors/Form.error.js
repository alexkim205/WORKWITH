class FormError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FormError';
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

export default FormError;
