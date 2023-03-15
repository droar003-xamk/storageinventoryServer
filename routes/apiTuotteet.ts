import express from 'express';
import Tuotelista, { Tuote } from '../models/tuotelista';
import { Virhe } from '../errors/virhekasittelija';

const tuotelista: Tuotelista = new Tuotelista();

const apiTuotteetRouter: express.Router = express.Router();

apiTuotteetRouter.use(express.json());

apiTuotteetRouter.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        res.json(tuotelista.haeKaikki());
    } catch (e: any) {
        next(new Virhe(400, ""));
    }

});

apiTuotteetRouter.get("/varastotilanne/:id", async (req: express.Request, res: express.Response , next: express.NextFunction) => {
    try {
        const id = Number(req.params.id);

        const tuote = tuotelista.haeYksi(id);

        if(tuote){
            res.json({varastotilanne : tuote.varastotilanne});
        }else{
            res.json({ varastotilanne : "ei tietoa"});
        }
    } catch (e: any) {
        next(new Virhe(400,"Tuotteen haku epäonnistui"));
    }
});

apiTuotteetRouter.get("/varastotilanne/", async (req: express.Request, res: express.Response , next: express.NextFunction) => {
    try {
        const koko = req.query.koko?.toString() ?? "";
        const vari = req.query.vari?.toString() ?? "";
        const tuote = tuotelista.haeKokoJaVari(koko, vari);

        if(tuote){
            res.json({varastotilanne : tuote.varastotilanne});
        }else{
            res.json({ varastotilanne : "ei tietoa"});
        }
    }catch (e: any){
        next(new Virhe(400,"Tuotteen haku epäonnistui"));
    }
});



apiTuotteetRouter.get("/:id", (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        if (tuotelista.haeYksi(Number(req.params.id))) {
            res.json(tuotelista.haeYksi(Number(req.params.id)))
        } else {
            res.status(400).json({ virhe: "virheellinen id" });
        }
    } catch (e: any) {
        res.status(500).json({ virhe: "tapahtui virhe" })
    }
});

apiTuotteetRouter.post("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let uusiTuote: Tuote = {
            id: 0,
            koko: req.body.koko,
            vari: req.body.vari,
            varastotilanne: req.body.varastotilanne,
        }
        await tuotelista.lisaa(uusiTuote);
        res.status(201).json({ "viesti": "Tuote lisätty onnistuneesti" });
    } catch {
        next(new Virhe(400, "Tuotteen lisääminen epäonnistui"));
    }
});

apiTuotteetRouter.put("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        let muokattuTuote: Tuote = {

            id: req.body.id,
            koko: req.body.koko,
            vari: req.body.vari,
            varastotilanne: req.body.varastotilanne,
        }
        await tuotelista.muokkaa(muokattuTuote, Number(req.params.id));
        res.json({ "viesti": "Tuote muokattu onnistuneesti" });
    } catch (e: any) {
        next(new Virhe(400, "Tuotteen muokkaaminen epäonnistui"));
    }

});

apiTuotteetRouter.delete("/:id", async (req: express.Request, res: express.Response , next: express.NextFunction) => {
    try {
    await tuotelista.poista(Number(req.params.id));
    res.json({ "viesti" : "Tuote poistettu onnistuneesti" });
    } catch (e : any) {
        next(new Virhe(400,"Tuotteen poistaminen epäonnistui"));
    }
});


export default apiTuotteetRouter;