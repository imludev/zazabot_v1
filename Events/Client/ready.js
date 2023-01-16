const { loadCommands } = require("../../Handlers/commandHandler");
const jsonconfig = require("../../config.json");
// let checkVideo = require("../../Functions/checkVideo");
// 

// 


module.exports = {
    name: "ready",
    /**
     * @param {Client} client 
     */
    async execute(client) {
        async function readyTasks() {
            console.log("</==========================\\>");
            console.log(`Client is ready.`);
            console.log("<|==========================|>");
            console.log(`Logged in as:\n\t- ${client.user.username || "Cannot find name"}\n\t- ${"#" + client.user.discriminator || "Cannot find discriminator"}\n\t- ${client.user.id || "Cannot find id"}\n\t- Logged in for guild ${jsonconfig.server.name || "Cannot find server name"}`);
            console.log("<|==========================|>");
            // Database Connection
            const { connect } = require("mongoose");
            await connect(process.env.MONGO_URI, {
            }).then(() =>
                console.log("\nDatabase Connection Successfull")
            );

            console.log("<|==========================|>");
            console.log("Console requirements");
            console.log("ready");
            console.log("online");
            console.log("success");
            console.log("<\\==========================/>");
        };
        await readyTasks();
        // STATUS
        const statusOptions = [
            `with ${client.guilds.cache.size} servers`,
            "Bot made by Odinsson25",
            `${jsonconfig.server.name}!`,
            `${client.users.cache.size} members`
        ];
        let counter = 0;
        let time = 7 * 1000;
        const updateStatus = () => {

            client.user.setPresence({

                status: "online",
                activities: [
                    {
                        name: statusOptions[counter]
                    }
                ],
            });

            if (++counter >= statusOptions.length) counter = 0;

            setTimeout(updateStatus, time);

        };
        updateStatus();

        loadCommands(client);
        
        const RSSParser = require("rss-parser");
        const ytChannel = await client.channels.fetch(jsonconfig.server.channels.ytUploadChannel);
        const request = new RSSParser();

        setInterval(async () => {
            const req = (await request.parseURL(`https://www.youtube.com/feeds/videos.xml?channel_id=${process.env.YT_ID}`)).items[0];

            let ifAlready = [...(await ytChannel.messages.fetch({ limit: 1 })).values()]
            if (ifAlready.length > 0) ifAlready = ifAlready[0].content.match(urlRegexp);
            if (ifAlready != null) ifAlready = ifAlready[1];
            if (ifAlready == req?.link) return;

            ytChannel.send(`${jsonconfig.messages.newYTPost.replace(`{url}`, req.link)}`);
        }, 5 * 1000)


        // https://www.youtube.com/watch?v=eET370wIJSM&list=PLv0io0WjFNn9LDsv1W4fOWygNFzY342Jm&index=13
        // const Parser = require("rss-parser");
        // const parser = new Parser();
        // const fs = require("fs");
        // async function checkVideo(client) {
        //     const data = await parser
        //         .parseURL(`http://youtube.com/feeds/videos.xml?channel_id=${process.env.YT_ID}`)
        //         .catch(console.error);
        //     const rawData = fs.readFileSync(`${__dirname}/../../json/video.json`);
        //     const jsonData = JSON.parse(rawData);
        //     if (jsonData.id !== data.items[0].id) {
        //         console.log(rawData, jsonData)

        //         // fs.writeFileSync(
        //         //     `${__dirname}/../../json/video.json`,
        //         //     JSON.stringify({ id: data.items[0].id })
        //         // );
        //         const guild = client.guilds.fetch(jsonconfig.server.id).catch(console.error);
        //         const channel = client.channels.fetch(
        //             // jsonconfig.server.channels.ytUploadChannel
        //             "1064204376228511926"
        //         ).catch(console.error);
        //         console.log("----" + channel, channel.name)
        //         const { title, link } = data.items[0];
        //         await channel.send(`lol, ${link}`)

        //     }
        // }
        // // 

        // setInterval(
        //     await checkVideo(client),
        //     // checkVideo.checkVideo(),
        //     5 * 1000);

    }
}