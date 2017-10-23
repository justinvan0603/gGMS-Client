export class ApplicationUser
{
    FULLNAME 				   :string;
	PASSWORD                   :string;
	PHONE                      :string;
	PARENT_ID                  :string;
	DESCRIPTION                :string;
	RECORD_STATUS              :string;
	AUTH_STATUS                :string;
	CREATE_DT                  :Date;
	APPROVE_DT                 :Date;
	EDIT_DT                    :Date;
	MAKER_ID                   :string;
	CHECKER_ID                 :string;
	EDITOR_ID                  :string;
	APPTOKEN                   :string;
	Id                         :string;
	UserName                   :string;
	NormalizedUserName         :string;
	Email                      :string;
	NormalizedEmail            :string;
	EmailConfirmed             :boolean;
	PasswordHash               :string;
	SecurityStamp              :string;
	ConcurrencyStamp           :string;
	PhoneNumber                :string;
	PhoneNumberConfirmed       :boolean;
	TwoFactorEnabled           :boolean;
	LockoutEnd                 :string;
	LockoutEnabled             :boolean;
	AccessFailedCount          :string;
	Roles                      :string;
	Claims                     :string;
	Logins                     :string;
    constructor()
    {
        	this.FULLNAME 				   ='';
	this.PASSWORD                   ='';
	this.PHONE                      ='';
	this.PARENT_ID                  ='';
	this.DESCRIPTION                ='';
	this.RECORD_STATUS              ='';
	this.AUTH_STATUS                ='';
	this.CREATE_DT               	= new Date();
	this.APPROVE_DT              	= new Date();
	this.EDIT_DT                 	= new Date();
	this.MAKER_ID                	='';
	this.CHECKER_ID              	='';
	this.EDITOR_ID               	='';
	this.APPTOKEN                	='';
	this.Id                      	='';
	this.UserName                	='';
	this.NormalizedUserName      	='';
	this.Email                   	='';
	this.NormalizedEmail            ='';
	this.EmailConfirmed             =false;
	this.PasswordHash               ='';
	this.SecurityStamp              ='';
	this.ConcurrencyStamp           ='';
	this.PhoneNumber                ='';
	this.PhoneNumberConfirmed       =false;
	this.TwoFactorEnabled           =false;
	this.LockoutEnd                 ='';
	this.LockoutEnabled             =false;
	this.AccessFailedCount          ='';
	this.Roles                      ='';
	this.Claims                     ='';
	this.Logins                     ='';
    }

}