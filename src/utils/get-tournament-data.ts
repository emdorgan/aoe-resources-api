import * as cheerio from 'cheerio';
import { axiosRequest } from './axios-request';

type GridCellData = {
    text: string;
    href: string;
}

type Tournament = Partial<{
    "tier": GridCellData;
    "gs": GridCellData;
    "tournament": GridCellData;
    "date": GridCellData;
    "prizepool": GridCellData;
    "location": GridCellData;
    "p": GridCellData;
    "winner": GridCellData;
    "runner-up": GridCellData;
}>;

export const getTournamentData = async (tournamentUrl : string) => {
    const rawTournamentData = await axiosRequest(tournamentUrl);
    const rawTournamentHTML = Object.values(rawTournamentData.data.parse.text)[0] as string;
    const $ = cheerio.load(rawTournamentHTML);
    const listOfTournamentsInYear = $('.gridTable')
    const listOfTournaments : Tournament[][] = [];
    
    listOfTournamentsInYear.each((index, table) => {
        const gridCellData : GridCellData[] = [];
        const gridCells = $(table).find('.gridCell');
        gridCells.each((index, cell) => {
            const href = $(cell).find('a').attr('href');
            const text = $(cell).text().trim();
            gridCellData.push({ text: text, href: href});
        })
        const tournamentHeaders = gridCellData.splice(0, 9).map(element => element.text.toLowerCase().replace(/[\s#&]/g, ""));
        let tournamentList : Tournament[] = [];
        let tournament : Tournament = {};

        for(let i=0; i < gridCellData.length; i+= tournamentHeaders.length) {
            tournamentHeaders.forEach((element, indexHeader) => {
                tournament = {
                    ...tournament,
                    [element]: gridCellData[indexHeader + i]
                };
            });

        tournamentList.push(tournament);
        };

        listOfTournaments.push(tournamentList);
    });

    return listOfTournaments;

}
