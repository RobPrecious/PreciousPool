/**
 * Save this code to a file called convertToJSON.js, install node - https://nodejs.org/en/download/
 * 1. create a folder called 'export' (mkdir export)
 * 2. create a file called input.txt (touch input.txt)
 * 3. copy all (cmd-A then cmd-C) in the excel sheet then paste into input.txt
 * 4. run the script using 'node convertToJSON'
 */

var fs = require("fs");
var path = require("path");

const inputPath = path.join(__dirname, "input.txt");

const getInput = (path) => fs.readFileSync(path, { encoding: "utf8" });

const exportToFile = (path, data) =>
  fs.writeFileSync(path, JSON.stringify(data, null, 2));

const importFromCsv = (text) => {
  const games = text.split("\n");
  games.shift();
  return games.reduce((acc, game) => {
    const properites = game.trim().split("\t");
    const [day, month, year] = properites[0].split("/");
    const date = new Date(20 + year, parseInt(month) - 1, parseInt(day) + 1);

    return [
      ...acc,
      {
        date,
        player_1: properites[1],
        player_2: properites[2],
        winner: properites[3],
      },
    ];
  }, []);
};

const input = getInput(inputPath);
exportToFile(`./export.json`, importFromCsv(input));
