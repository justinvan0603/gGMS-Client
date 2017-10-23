export class SourceModel {
  SourceId: string;
  SourceCode: string;
  SourceLocation: string;
  SourceName: string;
  Price: number;
  PriceVat: number;
  Vat: number;
  DiscountAmt: number;
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
    this.SourceId = '';
    this.SourceCode = '';
    this.SourceLocation = '';
    this.SourceName = '';
    this.Price = 0;
    this.PriceVat = 0;
    this.Vat = 0;
    this.DiscountAmt = 0;
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