import { PrjInstalledPlugin } from "./prjinstalledplugin";

export class PrjInstalledPluginViewModel
{
    public  PluginId :string;
    public  PrjInstalledPlugin: PrjInstalledPlugin;
    public  IsChecked :boolean;
    public PrjInstalledPluginViewModel()
    {
        this.PluginId = '';
        this.PrjInstalledPlugin = new PrjInstalledPlugin();
        this.IsChecked = false;
    }
}