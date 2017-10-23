export class LinkNotification
{
    ID: number;
    USERNAME : string;
    DOMAIN_ID : string;
    IS_TOUT : string;
    IS_CIP: string;
    IS_RDOM: string;
    IS_ECODE: string;
    IS_CCON: string;
    constructor()
    {
        this.ID= 0;
        this.USERNAME = '';
        this.DOMAIN_ID = '';
        this.IS_TOUT = '0';
        this.IS_CIP = '0';
        this.IS_RDOM = '0';
        this.IS_ECODE = '0';
        this.IS_CCON = '0';
    }
}