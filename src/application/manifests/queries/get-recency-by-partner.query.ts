export class GetRecencyByPartnerQuery {
    county?: string;
    agency?: string;
    partner?: string;
    period?: string;

    constructor(public docket: string) {
    }
}