/* eslint-disable max-classes-per-file */
export class ResponseDto<T> {
  constructor(
    public messageKey: string, // Translation key for the message
    public data: T, // The actual data to return
    public meta?: Record<string, string | number | boolean>, // Optional meta information
  ) {}
}

export class ResponseForInterceptorDto<T> {
  constructor(
    public message: string, // Translation key for the message
    public data: T, // The actual data to return
    public meta?: Record<string, string | number | boolean>, // Optional meta information
  ) {}
}
