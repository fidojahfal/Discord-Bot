require('dotenv').config();
const { Client, Message, MessageAttachment } = require('discord.js');
const client = new Client();
const PREFIX = "%";

client.on('ready', ()=>{
    console.log(`${client.user.username} is Online`);
});

client.on('message', async (message)=>{
    const gif = new MessageAttachment('https://media.giphy.com/media/H99r2HtnYs492/giphy.gif');
    const gif2 = new MessageAttachment('https://media.giphy.com/media/yJFeycRK2DB4c/giphy.gif')
    if(message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`);
    if(message.content === 'Halo'){
        message.channel.send('Bangsat kau!');
    }
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/)
        console.log(CMD_NAME);
        console.log(args);

    if(CMD_NAME === "kick"){
        if(!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply('You dont have permissions to use that command');
        
        if(args.length === 0) 
            return message.reply('Please provide an ID');
        
        const member = message.guild.members.cache.get(args[0]);
        const member2 = member.guild.member(message.mentions.users.first());
            if(member){
                member
                .kick()
                .then((member) => message.channel.send(`${member} was kicked`))
                .catch((err) => message.channel.send('I cannot kick admin :('));
            }else{
                message.channel.send('That member was not found');
        }if(member2){
            member
            .kick()
            .then((member) => message.channel.send(`${member} was kicked`))
            .catch((err) => message.channel.send('I cannot kick admin :('));
        }else{
            message.channel.send('That member was not found');
        }
    }else if(CMD_NAME === 'ban'){
        if(!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('You dont have permissions to use that command');
        if(args.length === 0) 
            return message.reply('Please provide an ID');
        try{
            const user = await message.guild.members.ban(args[0]);
            message.reply('That user was banned', gif);
        }catch(err){
            console.log(err)
            message.channel.send('I dont have permission or the user was not found');
        }
    }else if(CMD_NAME == 'unban'){
        if(!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('You dont have permissions to use that command');
        
        if(args.length === 0) 
            return message.reply('Please provide an ID');
            try{
                const user = await message.guild.members.unban(args[0]);
                message.reply('That user was unbanned', gif2);
            }catch(err){
                console.log(err)
                message.channel.send('I dont have permission or the user was not found');
            }
    }
  }
})

client.login(process.env.DISCORDJS_BOT_TOKEN);
