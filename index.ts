import express from 'express';
import path from 'path';
import apiTuotteetRouter from './routes/apiTuotteet';
import virhekasittelija from './errors/virhekasittelija';

const app : express.Application = express();

const port: number = Number (process.env.PORT) || 3103;


app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/tuotteet", apiTuotteetRouter);

app.use(virhekasittelija);

app.listen(port, ()=> {
    console.log(`palvelin käynnistyi porttiin : ${port}`);
});