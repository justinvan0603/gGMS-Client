

export class Feature  {
	    public Id :number;
          public FeaType :string;
          public Contents :string;
          public Level :number;
          public Resource :string;
          public RecordStatus :string;
          public AuthStatus :string;
          public ApproveDt :Date;
          public EditDt:Date;
          public CheckerId:string;
          public EditorId :string;
          public CreateDt :Date;
          public MakerId :string;
          constructor()
          {
              this.Id = 0;
              this.ApproveDt = new Date();
              this.AuthStatus = '';
              this.CheckerId  = '';
              this.Contents = '';
              this.CreateDt = new Date();
              this.EditDt = new Date();
              this.EditorId = '';
              this.FeaType = '';
              this.Level = 1;
              this.MakerId = '';
              this.RecordStatus = '1';
              this.Resource = '';

          }
}