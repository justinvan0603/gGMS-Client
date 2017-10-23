import {ContractModel } from "./contract"
import {ContractDetail } from "./contract-dt"
//import {CmsContractFileUpload} from "../contractfileupload/cmscontractfileupload";
export  class ContractViewModel {
  Contract : ContractModel;
  ContractDetails : ContractDetail[];
  //ContractFiles: CmsContractFileUpload[];
  //Files : CmsContractFileUpload[];
  constructor() {
    this.Contract = new ContractModel();
    this.ContractDetails = new Array<ContractDetail>();
    //this.ContractFiles = new Array<CmsContractFileUpload>();
    //this.Files = new Array<CmsContractFileUpload>();
  }
}