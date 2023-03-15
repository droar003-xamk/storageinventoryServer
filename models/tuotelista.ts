import { readFile, writeFile } from 'fs/promises';
import path from "path";

export interface Tuote {
    id: number,
    koko: string,
    vari: string,
    varastotilanne: number
}

class Tuotelista{

    private tuotteet : any[] = [];
    private tiedosto : string [] = [__dirname, "tuotteet.json"];

    constructor(){

        readFile(path.resolve(...this.tiedosto), "utf8")
        .then((data : string) => {
            this.tuotteet = JSON.parse(data);
        })
        .catch((e : any )=>{
                throw new Error(e);
        });
    }

    public haeKaikki = () => {
        
        try{
            return this.tuotteet;
        }catch (e : any){
            throw new Error(e);
        }
    }
    public haeYksi = (id: number) : Tuote | undefined => {
        
        try{
            return this.tuotteet.find((tuote: Tuote)=> tuote.id === id);
        }catch (e : any){
            throw new Error(e);
        }
    }

    public haeKokoJaVari = (koko: string, vari: string) : Tuote | undefined => {
        try {
            return this.tuotteet.find((tuote: Tuote) => {
                return tuote.koko === koko && tuote.vari === vari;
            });
        } catch (e: any) {
            throw new Error(e);
        }
    }

    public lisaa = async (uusiTuote: Tuote) : Promise <void> => {
        
        try{
            this.tuotteet = [
                ...this.tuotteet,
                {
                    id: this.tuotteet.sort((a: Tuote, b: Tuote) => a.id -b.id)[this.tuotteet.length -1].id + 1,
                    koko: uusiTuote.koko,
                    vari: uusiTuote.vari,
                    varastotilanne: uusiTuote.varastotilanne,
                }
            ];
            await this.tallenna();

        }catch (e : any){
            throw new Error(e);
        }
    }
    private tallenna = async () : Promise<void> => {

        try{
            await writeFile(path.resolve(...this.tiedosto), JSON.stringify(this.tuotteet,null, 2), "utf8");
        }catch (e : any) {
            throw new Error ();
        }
    }
    public muokkaa = async (muokattuTuote: Tuote, id : number) : Promise <void> => {
        
        try{
            this.tuotteet = this.tuotteet.filter((tuote : Tuote) => tuote.id !== id );

            this.tuotteet = [
                ...this.tuotteet,
                {
                    id:id,
                    koko: muokattuTuote.koko,
                    vari: muokattuTuote.vari,
                    varastotilanne : muokattuTuote.varastotilanne
                }
            ].sort((a : Tuote, b : Tuote) => a.id -b.id);

            await this.tallenna();

        }catch (e : any){
            throw new Error(e);
        }
    }
    public poista = async ( id : number) : Promise <void> => {
        
        try{
            this.tuotteet = this.tuotteet.filter((tuote : Tuote) => tuote.id !== id );

            await this.tallenna();

        }catch (e : any){
            throw new Error(e);
        }
    }

}
export default Tuotelista;