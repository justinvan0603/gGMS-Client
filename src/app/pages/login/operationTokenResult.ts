export class OperationTokenResult {
    Succeeded: boolean;
    Message: string;
    Access_token :string;
    Expires_in:string

    // constructor(succeeded: boolean, message: string) {
    //     this.Succeeded = succeeded;
    //     this.Message = message;
    // }


  constructor(Succeeded: boolean, Message: string, Access_token: string, Expires_in: string) {
    this.Succeeded = Succeeded;
    this.Message = Message;
    this.Access_token = Access_token;
    this.Expires_in = Expires_in;
  }
}
