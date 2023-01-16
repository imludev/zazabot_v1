const { } = require("discord.js");
const Parser = require("rss-parser");
const parser = new Parser();
const fs = require("fs");
const jsonconfig = require("../config.json");
module.exports = (client) => {

    client.checkVideo = async () => {
        const data = await parser
            .parseURL(`https://youtube.com/feeds/videos.xml?channel_id=${process.env.YT_ID}`)
            .catch(console.error);
        const rawData = fs.readFileSync(`${__dirname}/../../video.json`);
        const jsonData = JSON.parse(rawData);
        console.log(rawData, jsonData)
        // if(jsonData.id !== data.items[0].id){
        //     fs.writeFileSync(
        //         `${__dirname}/../../video.json`,
        //         JSON.stringify({id: data.items[0].id})
        //     );
        //     const guild = client.guilds.fetch(jsonconfig.server.id).catch(console.error);
        //     const channel = guild.channel.fetch(jsonconfig.server.channels.ytUploadChannel).catch(console.error);

        // }
    }


}