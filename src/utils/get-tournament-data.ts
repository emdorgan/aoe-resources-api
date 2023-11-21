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
    "startDate": string;
    "endDate": string;
}>;

const formatDate = (rawDate : string) : {startDate : string, endDate : string} => {
    const dateRange = rawDate.split(" - ");

    if (!dateRange[1]) {
        return {
            startDate: dateRange[0],
            endDate: dateRange[0]
        };
    }

    const dateYear = dateRange[1].split(", ")[1];
    const dateStartMonth = dateRange[0].substring(0, 3);

    if (isNaN(Number(dateRange[1].charAt(0)))) {
        return {
            startDate: `${dateRange[0]}, ${dateYear}`,
            endDate: dateRange[1],
        };
    }

    return {
        startDate: `${dateRange[0]}, ${dateYear}`,
        endDate: `${dateStartMonth} ${dateRange[1]}`
    };
};

export const getTournamentData = async (tournamentUrl : string, tier : string) => {
    const rawTournamentData = await axiosRequest(tournamentUrl, tier);
    const rawTournamentHTML = Object.values(rawTournamentData.data.parse.text)[0] as string;
    const $ = cheerio.load(rawTournamentHTML);
    const listOfTournamentsInYear = $('.gridTable')
    const listOfTournaments : Tournament[] = [];
    
    listOfTournamentsInYear.each((index, table) => {
        const gridCellData : GridCellData[] = [];
        const gridCells = $(table).find('.gridCell');
        gridCells.each((index, cell) => {
            const href = $(cell).find('a').attr('href');
            const text = $(cell).text().trim();
            gridCellData.push({ text: text, href: href});
        })
        const tournamentHeaders = gridCellData.splice(0, 9).map(element => element.text.toLowerCase().replace(/[\s#&]/g, ""));
        let tournament : Tournament = {};

        for(let i=0; i < gridCellData.length; i+= tournamentHeaders.length) {
            tournamentHeaders.forEach((element, indexHeader) => {
                tournament = {
                    ...tournament,
                    [element]: gridCellData[indexHeader + i]
                };
            });

        listOfTournaments.push(tournament);
        };
    });

    const listOfTournamentsWithDates = listOfTournaments.map((element) => {
        return {...element, ...formatDate(element.date.text)}
    });

    return listOfTournamentsWithDates;
}
