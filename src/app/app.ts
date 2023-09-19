import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

import { RouterContext } from 'koa-router';
import { getTournamentData } from './queries/sTournament';

const sTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FS-Tier_Tournaments&format=json';
const aTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FA-Tier_Tournaments&format=json';
const bTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FB-Tier_Tournaments&format=json';
const cTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FC-Tier_Tournaments&format=json';

const compression = require('compression')
const cors = require('cors')
const Router = require('koa-router')

const app:Koa = new Koa();
const router = new Router();



app.use(async (context: Koa.Context, next: () => Promise<any>) => {
    try {
        await next();
        } catch (error) {
        context.status = error.statusCode || error.status || HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR;
        error.status = context.status;
        context.body = { error };
        context.app.emit('error', error, context);
    }
});

app.use(router.routes());

//@TODO: move routes into queries
// consider moving the get tournament function to utils

router.get('/s-tier', async (context : RouterContext) => {
    const sTierData = await getTournamentData(sTierTournamentUrl);
    context.body = sTierData
})

router.get('/a-tier', async (context : RouterContext) => {
    const sTierData = await getTournamentData(aTierTournamentUrl);
    context.body = sTierData
})

router.get('/b-tier', async (context : RouterContext) => {
    const sTierData = await getTournamentData(bTierTournamentUrl);
    context.body = sTierData
})

router.get('/c-tier', async (context : RouterContext) => {
    const sTierData = await getTournamentData(cTierTournamentUrl);
    context.body = sTierData
})

// Middleware
app.use(cors());
app.use(compression());

app.on('error', console.error);

export default app;