import { RouterContext } from 'koa-router';
import cors = require('@koa/cors');
import { getTournamentData } from '../utils/get-tournament-data';
import { Context } from 'koa';
import * as HttpStatus from 'http-status-codes';
const Router = require('koa-router');
const Koa = require('koa');
const compress = require ('koa-compress');

const sTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FS-Tier_Tournaments&format=json';
const aTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FA-Tier_Tournaments&format=json';
const bTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FB-Tier_Tournaments&format=json';
const cTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FC-Tier_Tournaments&format=json';

const app = new Koa();
export const router = new Router();



app.use(async (context : Context, next: () => Promise<any>) => {
    try {
        await next();
        } catch (error) {
        context.status = error.statusCode || error.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
        error.status = context.status;
        context.body = { error };
        context.app.emit('error', error, context);
    }
});

app.use(cors());
app.use(compress());

router.get('/s-tier', async (context : RouterContext) => {
    const sTierData = await getTournamentData(sTierTournamentUrl, 's');
    context.body = sTierData;
    context.status = 200;
});

router.get('/a-tier', async (context : RouterContext) => {
    const aTierData = await getTournamentData(aTierTournamentUrl, 'a');
    context.body = aTierData;
    context.status = 200;
});

router.get('/b-tier', async (context : RouterContext) => {
    const bTierData = await getTournamentData(bTierTournamentUrl, 'b');
    context.body = bTierData;
    context.status = 200;
});

router.get('/c-tier', async (context : RouterContext) => {
    const cTierData = await getTournamentData(cTierTournamentUrl, 'c');
    context.body = cTierData;
    context.status = 200;
});

app.use(router.routes());


app.on('error', console.error);

export default app;