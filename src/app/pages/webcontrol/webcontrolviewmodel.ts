import { CwWebControl } from "./cwwebcontrol";
import { PrjProject } from "../prjproject/prjproject";

export class WebControlViewModel
{
    public  CwWebControl :CwWebControl;
    public  PrjProjectMaster :PrjProject;
    public WebControlViewModel()
    {
        this.CwWebControl = new CwWebControl();
        this.PrjProjectMaster = new PrjProject();
    }
}