import {PrjProject } from "./prjproject"
import {PrjProjectDt } from "./prjproject-dt"
//import {CmsContractFileUpload} from "../contractfileupload/cmscontractfileupload";
export  class PrjProjectViewModel {
  Project : PrjProject;
  ProjectDT : PrjProjectDt[];
  //ContractFiles: CmsContractFileUpload[];
  //Files : CmsContractFileUpload[];
  constructor() {
    this.Project = new PrjProject();
    this.ProjectDT = new Array<PrjProjectDt>();
    //this.ContractFiles = new Array<CmsContractFileUpload>();
    //this.Files = new Array<CmsContractFileUpload>();
  }
}