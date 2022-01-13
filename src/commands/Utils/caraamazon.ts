import MessageHandler from '../../Handlers/MessageHandler'
import BaseCommand from '../../lib/BaseCommand'
import WAClient from '../../lib/WAClient'
import { ISimplifiedMessage } from '../../typings'
import axios from 'axios'
import request from '../../lib/request'
import { MessageType } from '@adiwajshing/baileys'
// import { MessageType, Mimetype } from '@adiwajshing/baileys'

export default class Command extends BaseCommand {
    constructor(client: WAClient, handler: MessageHandler) {
        super(client, handler, {
            command: 'amazon',
            description: `Give you your amazon search result `,
            aliases: ['az'],
            category: 'utils',
            usage: `${client.config.prefix}amazon`,
            baseXp: 50
        })
    }

     run = async (M: ISimplifiedMessage, { joined }: IParsedArgs): Promise<void> => {

        if (!joined) return void M.reply('✖ Provide an item name to search, Baka!')
        const chitoge = joined.trim()
        console.log(chitoge)
        const { data } = await axios.get('https://leyscoders-api.herokuapp.com/api/amazon-search?q=${chitoge}&apikey=dappakntlll')
        const buffer = await request.buffer(data.result.thumb).catch((e) => {
            return void M.reply(e.message)
        })
        while (true) {
            try {
                M.reply(
                    buffer || '✖ An error occurred. Please try again later',
                    MessageType.image,
                    undefined,
                    undefined,
                    `*Product Name*: ${data.result.item}\n*Review*: ${data.result.review}\n*Rating*: ${data.result.rating}\n*Product Url*: ${data.result.url}\n `,
                    undefined
                ).catch((e) => {
                    console.log(`This Error occurs when an image is sent via M.reply()\n Child Catch Block : \n${e}`)
                    // console.log('Failed')
                    M.reply(`Could not fetch image. Here's the URL: ${data.url}`)
                })
                break
            } catch (e) {
                // console.log('Failed2')
                M.reply(`Could not fetch image. Here's the URL : ${data.url}`)
                console.log(`This Error occurs when an image is sent via M.reply()\n Parent Catch Block : \n${e}`)
            }
        }
        return void null
    }
}
