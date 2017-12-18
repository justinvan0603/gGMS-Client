import { PrjInstalledPlugin } from "./prjinstalledplugin";
import { PrjProject } from "../prjproject/prjproject";

export class PrjInstalledPluginViewModel
{
    public  PluginId :string;
    public  PrjInstalledPlugin: PrjInstalledPlugin;
    public  IsChecked :boolean;
    public PrjProjectMaster : PrjProject
    public PrjInstalledPluginViewModel()
    {
        this.PluginId = '';
        this.PrjInstalledPlugin = new PrjInstalledPlugin();
        this.PrjProjectMaster = new PrjProject();
        this.IsChecked = false;
    }
}