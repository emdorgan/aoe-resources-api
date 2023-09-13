import { axiosRequest } from "../../utils/axios-request";
const { convert } = require('html-to-text');

const htmlParserOptions = {
    selectors: [
        { selector: 'a', options: { baseUrl: 'https://liquipedia.net/' } },
        { selector: 'img', options: { baseUrl: 'https://liquipedia.net/' } },
        {selector: '.gridCell', options: {includeTextContentOnly: true}, format: 'block'}
    ],

};

const getListOfRelevantTournamentData = (text: string) => {

    //TODO: Modify algorithm to make a different array for each tournament rather than chaining them all together
    const lines = text.split('\n');
  const listOfRelevantTournamentData = lines.reduce((list: string[], item: string) => {
    if (item.trim() === 'Tier' && list.length === 0) {
      return [item, ...list];
    }

    if (list.length > 0) {
        return [item, ...list];
    }

    return list;
  }, []);
  return listOfRelevantTournamentData.reverse().filter((item : string) => item.trim() !== '');
}

export const getSTierTournamentData = async () => {
    const sTierTournamentUrl = 'https://liquipedia.net/ageofempires/api.php?action=parse&page=Age_of_Empires_II%2FS-Tier_Tournaments&format=json';
    const rawSTierTournament = await axiosRequest(sTierTournamentUrl);
    const sTierTournamentText = Object.values(rawSTierTournament.data.parse.text)[0];
    const sTierTournamentParsed = convert(sTierTournamentText, htmlParserOptions)
    console.log(sTierTournamentParsed)
    const sTierTournamentList = getListOfRelevantTournamentData(sTierTournamentParsed)

    console.log(sTierTournamentList)

    return sTierTournamentList;
}
