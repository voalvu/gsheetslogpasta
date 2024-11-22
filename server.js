import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import clipboardy from 'clipboardy';
import cors from 'cors';
const app = express();
const PORT = 3000;
const ENABLE_CLIPBOARD = true;

app.use(cors()); 
app.use(bodyParser.json());

// Endpoint for receiving social media links from userscript fetch request
app.post('/api/data', (req, res) => {
    const { followerCount, viewerCount, links,livetime,url } = req.body;

    // Log format with timestamp. one entry per line
    const logEntry = {
        timestamp: new Date().toISOString(),
        followerCount,
        viewerCount,
        links,
        livetime,
        url
    };

    // Log file and copy onto clipboard
    fs.appendFile('data.log', JSON.stringify(logEntry) + '\n', (err) => {
        if (err) {
            console.error('Error writing to file', err);
            return res.status(500).send('Error writing to file');
        }
        let discord;
        let instagram;
        let youtube;
        let patreon;
        let bluesky;
        let twitter;
        let tiktok;
        for(let l of links){
            if(l.includes("discord")){
                discord = l
            }else if(l.includes("twitter") || l.includes("x.com")){
                twitter = l
            }else if(l.includes("instagram")){
                instagram = l
            }else if(l.includes("youtube")){youtube=l}
            else if(l.includes("patreon")){patreon=l}
            else if(l.includes("bluesky")){bluesky=l}
            else if(l.includes("tiktok")){tiktok=l}
        }

        // Format this however you want with data
        // When pasting into Google sheets,
        // for multiline text in a single cell, wrap in "" quotes "line1\r\nline2"

        // \r\n because "In Excel, for example, you typically need to use \r\n (Carriage Return + Line Feed) to create a new line within a cell."
        if(ENABLE_CLIPBOARD){
            const clipboardText = `${url}\n${followerCount}\n${viewerCount}\n${livetime}\n\n${discord}\n\n\n\n\n\n"${links.join('\r\n')}"`;
            
            // Copy the text to the clipboard
            clipboardy.write(clipboardText).then(() => {
                console.log('Data copied to clipboard');
            }).catch(err => {
                console.error('Error copying to clipboard', err);
            });
        }
        res.status(200).send('Data received');
    });

});

app.listen(PORT, () => {
    console.log(`Userscript data listener is running on http://localhost:${PORT}`);
    console.log(`ENABLE_CLIPBOARD is set to ${ENABLE_CLIPBOARD}`)
});
