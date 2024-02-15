import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
  constructor(
    message: string = "There is already a resource with this identifier"
  ) {
    super(409, message);
  }
}
