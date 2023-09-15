import { axiosRequest } from "../../utils/axios-request";
import * as cheerio from 'cheerio';


interface GridCellData {
    text: string;
    href: string;
}

interface GridTableData {
    table: GridCellData[]
}

interface GridRow {
    '': string;
    
}

export const getSTierTournamentData = async () => {
    const sTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FS-Tier_Tournaments&format=json';
    const rawSTierTournament = await axiosRequest(sTierTournamentUrl);
    const sTierTournamentHTML = Object.values(rawSTierTournament.data.parse.text)[0] as string;
    const $ = cheerio.load(sTierTournamentHTML);
    const gridTables = $('.gridTable')
    const gridTableData : any = [];
    
    gridTables.each((index, table) => {
        const gridCellData : GridCellData[] = [];
        const gridCells = $(table).find('.gridCell');
        gridCells.each((index, cell) => {
            const href = $(cell).find('a').attr('href');
            const text = $(cell).text().trim();
            gridCellData.push({ text: text, href: href});
        })

        const gridCellHeaders = gridCellData.splice(0, 9);

        let gridTable : any = []
        let gridRow = {}
        for(let i=0; i<gridCellData.length; i+= gridCellHeaders.length) {

            gridCellHeaders.forEach((element, indexHeader) => {
                gridRow = {
                    ...gridRow,
                    [element.text]: gridCellData[indexHeader + i]
                };
            });
            console.log(gridRow)
            gridTable.push(gridRow);
        }

        gridTableData.push(gridTable)
    });

    return gridTableData;

    }
