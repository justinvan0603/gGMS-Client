export class PrdTemplate
{
    TemplateId		:string 
    TemplateCode    :string 
    TemplateName    :string 
    TemplateLocation:string 
    Notes           :string 
    RecordStatus    :string 
    MakerId         :string 
    DepId           :string 
    CreateDt     	:Date 
    AuthStatus      :string 
    CheckerId       :string 
    ApproveDt    	:Date 
    EditorId        :string 
    EditDt       	:Date 
    Price :number;
          PriceVat :number;
          Vat :number;
          DiscountAmt :number;
    IMAGES_PATH  :string;
    DEMO_LINK : string;
    //ListImages: any;
    constructor()
    {
        this.TemplateId		= '';
        this.TemplateCode    = '';
        this.TemplateName    = '';
        this.TemplateLocation= '';
        this.Notes           = '';
        this.RecordStatus    = '';
        this.MakerId         = '';
        this.DepId           = '';
        this.CreateDt     	= new Date();
        this.AuthStatus      = '';
        this.CheckerId       = '';
        this.ApproveDt    	= new Date();
        this.EditorId        = '';
        this.EditDt       	= new Date();
        this.Price = 0;
        this.PriceVat = 0;
        this.Vat = 0;
        this.DiscountAmt = 0; 
        this.IMAGES_PATH = '';
        this.DEMO_LINK = '';
    }
}