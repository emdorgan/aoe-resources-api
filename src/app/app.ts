import * as Koa from 'koa';
import * as HttpStatus from 'http-status-codes';

import { RouterContext } from 'koa-router';
import { getSTierTournamentData } from './queries/sTournament';

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

router.get('/s-tier', async (context : RouterContext) => {
    const sTierData = await getSTierTournamentData();
    context.body = sTierData
})

// Middleware
app.use(cors());
app.use(compression());

app.on('error', console.error);

export default app;