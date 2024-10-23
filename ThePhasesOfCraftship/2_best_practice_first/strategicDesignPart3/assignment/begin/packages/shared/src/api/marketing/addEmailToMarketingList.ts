export class AddEmailToListResponse {
    success: boolean;
    data: {};
    error: any;
  
    constructor(success: boolean, email: string, error: any = {}) {
      this.success = success;
      this.data = { email };
      this.error = error;
    }
  }
  