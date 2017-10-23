export class ContractDetail {
    ContractId: string;
    ProductId: string;
    Notes: string;
    RecordStatus: string;
    MakerId: string;
    DepId: string;
    CreateDt: Date;
    AuthStatus: string;
    CheckerId: string;
    ApproveDt: Date;
    EditorId: string;
    EditDt: Date;

  constructor() {
    this.ContractId = '';
    this.ProductId = '';
    this.Notes = '';
    this.RecordStatus = '';
    this.MakerId = '';
    this.DepId = '';
    this.CreateDt = new Date();
    this.AuthStatus = '';
    this.CheckerId = '';
    this.ApproveDt = new Date();
    this.EditorId = '';
    this.EditDt = new Date();
  }
}