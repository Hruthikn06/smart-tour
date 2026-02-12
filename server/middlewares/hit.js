const chalk = require("chalk");

async function hitMiddleWare(req, _, next) {
    try {
        console.log(chalk.redBright(`HIT ${req.path}`));
    } catch (error) {
        console.log(error);
    } finally {
        next();
    }
}

module.exports = { hitMiddleWare };