export class MyModelGen {
  Source: string;
  Destination: string;
  IsOverride: boolean;
  DatabaseName: string;
  MySqlConnectionString: string;
  DatabaseUser: string;
  Password: string;
  ScriptLocation: string;
  Domain: string;
  Subdomain: string;
  constructor() {
    this.Source = '';
    this.Destination = '';
    this.IsOverride = true;
    this.DatabaseName = '';
    this.DatabaseUser = '';
    this.Password = '';
    this.MySqlConnectionString = '';
    this.ScriptLocation = '';
    this.Domain = '';
    this.Subdomain = '';
  }

}