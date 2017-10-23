
import { PrdProduct } from "./prdproducts";
import { SourceModel } from "../source/source";
import { PrdPlugin } from "../prdplugins/prdplugins";
import { PrdTemplate } from "../prdtemplates/prdtemplates";
import { TreeModule, TreeNode } from 'angular-tree-component';

export class PrdProductViewModel
{
    public PrdProduct: PrdProduct;
    public ListSources: SourceModel[];
    public ListPlugins: PrdPlugin[];
    public ListTemplates: PrdTemplate[];
    public ListCategory : TreeNode[];
    public ListSelectedCategory : TreeNode[];
    constructor()
    {
        this.PrdProduct = new PrdProduct();
        this.ListSources = new Array<SourceModel>();
        this.ListPlugins = new Array<PrdPlugin>();
        this.ListTemplates = new Array<PrdTemplate>();
        this.ListCategory = new Array<TreeNode>();
        this.ListSelectedCategory = new Array<TreeNode>();
    }
}