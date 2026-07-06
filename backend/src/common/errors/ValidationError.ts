import { ApiError } from "./ApiErrors.js";

export class ValidationError extends ApiError {
  constructor(message = "Validation failed") {
    super(400, message);
  }
}
