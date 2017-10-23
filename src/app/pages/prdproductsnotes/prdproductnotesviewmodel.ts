
import { PrdProductNotes } from "./prdproductsnotes";
import { PrdPlugin } from "../prdplugins/prdplugins";
import { PrdTemplate } from "../prdtemplates/prdtemplates";
import { TreeModule, TreeNode } from 'angular-tree-component';
import { SourceModel} from "../source/source";

export class PrdProductNotesViewModel
{
    public PrdProduct: PrdProductNotes;
    public ListSources: SourceModel[];
    public ListPlugins: PrdPlugin[];
    public ListTemplates: PrdTemplate[];
    public ListCategory : TreeNode[];
    public ListSelectedCategory : TreeNode[];
    constructor()
    {
        this.PrdProduct = new PrdProductNotes();
        this.ListSources = new Array<SourceModel>();
        this.ListPlugins = new Array<PrdPlugin>();
        this.ListTemplates = new Array<PrdTemplate>();
        this.ListCategory = new Array<TreeNode>();
        this.ListSelectedCategory = new Array<TreeNode>();
    }
}