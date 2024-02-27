const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const axios = require('axios')
const run = require('./conf/gemini.js');
const {LocalAuth } = require('whatsapp-web.js');


const client = new Client({
    authStrategy: new LocalAuth()
});
 

client.on('qr', qr => {
    qrcode.generate(qr, {small: true})
});

client.on('ready', () => {
    console.log('O Wpp-Sticker está pronto 😋 Não esquece da estrelinha no repo ⭐')
});

client.on('message_create', msg => {
    const command = msg.body.split(' ')[0];
    console.log("NUMERO (" + msg.from + "): " + msg.body)
    const sender = msg.from.includes("85067794") ? msg.to : msg.from
    if (command === "/sticker"){
        generateStaticSticker(msg, sender)
    } 
    if(msg.body.startsWith("/") && msg.type === "chat") {
        run(msg.body).then((response) => {
            client.sendMessage(sender, response)
        }).catch((e) => {
            console.log(e)
            client.sendMessage(sender, "❌ Erro ao processar mensagem")
        })
    }

});

client.initialize();

const generateStaticSticker = async (msg, sender) => {
    if(msg.type === "image") {
        try {
            const { data } = await msg.downloadMedia()
            const image = await new MessageMedia("image/jpeg", data, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
        } catch(e) {
            msg.reply("❌ Erro ao processar imagem")
        }
    } else {
        try {

            const url = msg.body.substring(msg.body.indexOf(" ")).trim()
            const { data } = await axios.get(url, {responseType: 'arraybuffer'})
            const returnedB64 = Buffer.from(data).toString('base64');
            const image = await new MessageMedia("image/jpeg", returnedB64, "image.jpg")
            await client.sendMessage(sender, image, { sendMediaAsSticker: true })
        } catch(e) {
            msg.reply("❌ Não foi possível gerar um sticker com esse link")
        }
    }
}