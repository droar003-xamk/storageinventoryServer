import express from 'express';


export class Virhe extends Error{

    status : number
    viesti : string

    constructor( status: number, viesti : string) {

        super();
        this.status = status;
        this.viesti = viesti;
    }
}

const virhekasittelija = (err : any, req : express.Request, res : express.Response, next : express.NextFunction) => {
    res.status(err.status || 500).json({ "viesti": err.viesti || "Tapahtui virhe" });
    
}

export default virhekasittelija;