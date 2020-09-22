require('dotenv').config();
const { Client, MessageAttachment, Util } = require('discord.js');
// const DEFAULT_PREFIX =  require('./config.json')
const Discord = require('discord.js')
const ytdl = require('ytdl-core');
const ms = require('ms')
const moment = require('moment')
const YouTube = require('simple-youtube-api');
const mongoose = require('mongoose');
const client = new Client();
const GUILD = require('../model/prefix')
const queue = new Map();
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const PREFIXES = "%"

client.on('ready', ()=>{
    console.log(`${client.user.username} is Online`);
    client.user.setActivity('WORK IN PROGRESS',{type: 'WATCHING'}).catch(console.error)
    mongoose.connect(process.env.MONGO_CONNECTION, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Connected to database');
    })
    .catch(err=>{
        console.log(err);
    });
});



client.on('message', async (message)=>{

    const setting = await GUILD.findOne({
        guildId: message.guild.id,
        guildName: message.guild.name
    },(err, guild) =>{
        if(err){
            console.log(err)
        }
        if(!guild){
            const newGuild = new GUILD({
                _id: mongoose.Types.ObjectId(),
                guildId: message.guild.id,
                guildName: message.guild.name,
                PREFIX: PREFIXES
                
            })
            newGuild.save()
            .then(result => console.log(result))
            .catch(err => console.log(err))

            return message.channel.send('This server was not in our database, so we have added it and you now have default prefix(%)')
        }
    })
    
    let PREFIX = setting.PREFIX;
    const gif = new MessageAttachment('https://media.giphy.com/media/H99r2HtnYs492/giphy.gif');
    const gif2 = new MessageAttachment('https://media.giphy.com/media/yJFeycRK2DB4c/giphy.gif')
    const noPower = new MessageAttachment('https://media.giphy.com/media/eH7VY6kryYcsE/giphy.gif')
    const inoPower = new MessageAttachment('https://media.giphy.com/media/1414ExGiWDbVMA/giphy.gif');
    const same = new MessageAttachment('https://i.imgur.com/hVjMRgf.jpg')
    if(message.author.bot) return;
    console.log(`[${message.author.tag}]: ${message.content}`);
    if(message.content === 'Halo'){
        message.channel.send('Bangsat kau! :rage: ');
    }
    if(message.content === 'Hello?'){
        Mention = new Discord.Message()
        message.channel.send(`<@STORM>Berkumpul!`);
    }
    if(message.content === 'prefix'){
        message.reply(`My prefix is ${PREFIX}`)

    }
    if(message.content.startsWith(PREFIX)){
        const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/)
        console.log(CMD_NAME);
        console.log(args);

    if(CMD_NAME === "kick"){
        const member = message.guild.member( message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        const reason = args[1]
        if(!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply('You dont have permissions to use that command', noPower);
        if(!message.guild.me.hasPermission('KICK_MEMBERS')){
            return message.reply('I dont have permissions to use that command')
        }
        if(args.length === 0) 
            return message.reply('Please provide an ID or mention user');

        if(!member){
            return message.reply('I cant find that user')
            }

        if(member.id === message.author.id){
            return message.reply('Why would you kick yourself?')
        }
        
            if(member.kickable){
                var embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor('#ffd300')
                .setDescription(`
                **Member:** ${member.user.username} - (${member.user.id})
                **Action:** Kick
                **Reason:** ${reason}`)
                .setFooter(message.channel.name)
                .setTimestamp()
                message.channel.send(embed)
                member.kick()
            }else{
                return message.reply('i cant kick role that higher than me or same as me', same)
            }
            return undefined
    }else if(CMD_NAME === 'ban'){
        const member = message.guild.member( message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        const reason = args[1]
        if(!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('You dont have permissions to use that command', noPower);
        if(!message.guild.me.hasPermission('BAN_MEMBERS')){
            return message.reply('I dont have permissions to use that command')
        }
        if(args.length === 0) 
            return message.reply('Please provide an ID or mention user');
        
        if(!member){
            return message.reply('I cant find that user')
        }

        if(member.id === message.author.id){
            return message.reply('Why would you ban yourself?')
        }
        
            if(member.bannable){
                var embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
                .setThumbnail(member.user.displayAvatarURL())
                .setColor('#ffd300')
                .setDescription(`
                **Member:** ${member.user.username} - (${member.user.id})
                **Action:** Banned
                **Reason:** ${reason}`)
                .setFooter(message.channel.name)
                .setTimestamp()
                message.channel.send(embed)
                member.ban()
            }else{
                return message.reply('i cant banned role that higher than me or same as me', same)
            }
            return undefined
    }else if(CMD_NAME === 'softban'){
        const member = message.guild.member( message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        const reason = args[1]
        if(!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('You dont have permissions to use that command', noPower);
        if(!message.guild.me.hasPermission('BAN_MEMBERS')){
            return message.reply('I dont have permissions to use that command')
        }

        if(args.length === 0) 
            return message.reply('Please provide an ID or mention user');
        
        if(!member){
            return message.reply('I cant find that user')
        }

        if(member.id === message.author.id){
            return message.reply('Why would you softban yourself?')
        }

        if(member.bannable){
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#ffd300')
            .setDescription(`
            **Member:** ${member.user.username} - (${member.user.id})
            **Action:** Softbanned
            **Reason:** ${reason}`)
            .setFooter(message.channel.name)
            .setTimestamp()
            message.channel.send(embed)
            member.ban({days: 1}).then(()=> message.guild.members.unban(member.id))
        }else{
            return message.reply('i cant softban role that higher than me or same as me', same)
        }
        return undefined

    }else if(CMD_NAME === 'mute'){
        const member = message.guild.member( message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        const reason = args[2]
        const regex = /\d+[smhdw]/.exec(args[1])
        const regex2 = !/[^a-zA-Z0-9]+/g.test(name)
        if(!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply('You dont have permissions to use that command', noPower);
        if(!message.guild.me.hasPermission('MANAGE_ROLES')){
            return message.reply('I dont have permissions to mute')
        }

        if(args.length === 0) 
            return message.reply('Please provide an ID or mention user to mute user');
        if(!args[1])
            return message.reply('You need to specify how long you want to mute this user')
        if(![regex])
            return message.reply('That is not a valid amount of time to mute that member')
        if(ms(regex[0]) > 604832102)
            return message.reply('You can\'t mute a member for more than 7days')
        
        if(!member){
            return message.reply('I cant find that user')
        }

        if(member.id === message.author.id){
            return message.reply('Why would you mute yourself?')
        }

        if(member){
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#ffd300')
            .setDescription(`
            **Member:** ${member.user.username} - (${member.user.id})
            **Action:** Mute
            **Reason:** ${reason}
            **Length:** ${regex}`)
            .setFooter(message.channel.name)
            .setTimestamp()
            message.channel.send(embed).then(msg => {
                msg.delete({timeout: 10000})
            })
            if(member.roles.cache.has('756577618421219409')) return message.channel.send('This member is already muted')
            member.roles.add('756577618421219409')
            setTimeout(()=>{
                if(!member.roles.cache.has('756577618421219409')) return undefined
                member.roles.remove('756577618421219409')
                message.channel.send(`${member} has now been unmuted after ${regex[0]}`)
            }, ms(regex[0]))
        }else if(member){
            return message.reply('i cant mute role that higher than me or same as me', same)
        }
        return undefined

    }else if(CMD_NAME === 'unmute'){
        const member = message.guild.member( message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        const reason = args[1]
        if(!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply('You dont have permissions to use that command', noPower);
        if(!message.guild.me.hasPermission('MANAGE_ROLES')){
            return message.reply('I dont have permissions to unmute')
        }

        if(args.length === 0) 
            return message.reply('Please provide an ID or mention user to unmute user');
        
        if(!member){
            return message.reply('I cant find that user')
        }

        if(member.id === message.author.id){
            return message.reply('Why would you unmute yourself?')
        }

        if(!member.roles.cache.has('756577618421219409')) return message.reply('That user is already unmuted')

        if(member){
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#ffd300')
            .setDescription(`
            **Member:** ${member.user.username} - (${member.user.id})
            **Action:** Unmute
            **Reason:** ${reason}`)
            .setFooter(message.channel.name)
            .setTimestamp()
            message.channel.send(embed).then(msg => {
                msg.delete({timeout: 10000})
            })
            member.roles.remove('756577618421219409')
        }
        return undefined

    }else if(CMD_NAME === 'tempban'){
        const member = message.guild.member( message.mentions.members.first() || message.guild.members.cache.get(args[0]));
        const reason = args[2]
        const regex = /\d+[smhdw]/.exec(args[1])
        if(!message.member.hasPermission('BAN_MEMBERS'))
            return message.reply('You dont have permissions to use that command', noPower);
        if(!message.guild.me.hasPermission('BAN_MEMBERS')){
            return message.reply('I dont have permissions to use that command')
        }

        if(args.length === 0) 
            return message.reply('Please provide an ID or mention user to temporary banned');
        if(!args[1])
            return message.reply('You need to specify how long you want to ban this member for')
        if(![regex])
            return message.reply('That is not a valid amount of time to ban a member for')
        if(ms(regex[0]) > 604832102)
            return message.reply('You can\'t tempban a member for more than 7days')
        
        if(!member){
            return message.reply('I cant find that user')
        }

        if(member.id === message.author.id){
            return message.reply('Why would you tempban yourself?')
        }

        if(member.bannable){
            var embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL())
            .setThumbnail(member.user.displayAvatarURL())
            .setColor('#ffd300')
            .setDescription(`
            **Member:** ${member.user.username} - (${member.user.id})
            **Action:** Temporary Banned
            **Reason:** ${reason}
            **Length:** ${regex}`)
            .setFooter(message.channel.name)
            .setTimestamp()
            message.channel.send(embed).then(msg => {
                msg.delete({timeout: 10000})
            })
            member.ban()
            setTimeout(()=>{
                if(!message.guild.me.hasPermission('BAN_MEMBERS')) return message.channel.send("I dont\'t have permission to unban the user that i tempbanned")
                message.guild.members.unban(member.id)
                message.channel.send(`${member.user.username} has been unbanned after ${args[1]}`)
            }, ms(regex[0]))
        }else{
            return message.reply('i cant tempban role that higher than me or same as me', same)
        }
        return undefined

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
    }else if(CMD_NAME == 'embed'){
        
        const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#fffff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor(`Playing now - ${message.author.tag}`)
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/wSTFkRM.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

    message.channel.send(exampleEmbed);

    }else if(CMD_NAME === 'setPrefix'){
        if(!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send("You dont have permissions")
        if(!args[0]) return message.channel.send(`You need to specify a prefix, your current prefix is \`${setting.PREFIX}\``)

       await setting.updateOne({
           PREFIX: args[0]
       });

       return message.channel.send(`Your Server now have \`${args[0]}\` for prefix`)

    }else if(CMD_NAME === 'prune'){
        if(!message.member.hasPermission('MANAGE_CHANNELS')) return message.channel.send('You dont have permission to do this command')
        if(!message.guild.me.hasPermission('MANAGE_CHANNELS')) return message.channel.send('I dont have permission to do this command')
        if(!args[0]) return message.channel.send('You need to specify an amount of messages to purge')
        if(isNaN(args[0])) return message.channel.send('That is not a valid amount of messages to delete')
        if(args[0] > 1000 || args[0] < 1) return message.channel.send('Please make sure that your deleting messages from 1 - 1000')
        try {
            await message.channel.bulkDelete(args[0])
        }catch{
            return message.channel.send('You can only bulk delete messages within 14 days of ages')
        }
        var embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username} - ${message.author.id}`, message.author.displayAvatarURL)
        .setThumbnail(message.author.displayAvatarURL())
        .setColor('#ffd300')
        .setDescription(`
**Deleted:** ${args[0]}
**Action** Prune
**Channel:** ${message.channel}
**Time:** ${moment().format('llll')}
        `)
            message.channel.send(embed).then(msg => {
                msg.delete({timeout: 5000})
            })
    }
}
});

client.on('message', async message => {
    const setting = await GUILD.findOne({
        guildId: message.guild.id
    })

    let PREFIX = setting.PREFIX;
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;
    const serverQueue = queue.get(message.guild.id);

    const [CMD_NAME, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/)
        // console.log(CMD_NAME);
        // console.log(args);
    
    // const args = message.content.substring(PREFIX.length).split(' ');
	if (CMD_NAME === `play`) {
		execute(message, serverQueue);
		return;
	} else if (CMD_NAME === `skip`) {
		skip(message, serverQueue);
		return;
	} else if (CMD_NAME === `s`) {
		skip(message, serverQueue);
		return;
	}else if (CMD_NAME === `stop`) {
		stop(message, serverQueue);
		return;
	}else if (CMD_NAME === `p`) {
        // if(!args[0]) return message.channel.send(`You need to specify a music`)
        execute(message, serverQueue);
		return;
	} else if (CMD_NAME === `volume`) {
		volume(message, serverQueue);
        return;
    }else if (CMD_NAME === `v`) {
		volume(message, serverQueue);
        return;
    }else if (CMD_NAME === `pause`) {
		pause(message, serverQueue);
        return;
    }else if (CMD_NAME === `ps`) {
		pause(message, serverQueue);
        return;
    }else if (CMD_NAME === `resume`) {
		resume(message, serverQueue);
        return;
    }else if (CMD_NAME === `rs`) {
		resume(message, serverQueue);
        return;
    }else if (CMD_NAME === `np`) {
		np(message, serverQueue);
        return;
    }else if (CMD_NAME === `nowplaying`) {
		np(message, serverQueue);
        return;
    }else if (CMD_NAME === `queue`) {
		queueList(message, serverQueue);
        return;
    }else if (CMD_NAME === `q`) {
		queueList(message, serverQueue);
        return;
    }else if (CMD_NAME === `loop`) {
		loop(message, serverQueue);
        return;
    }else if (CMD_NAME === `l`) {
		loop(message, serverQueue);
        return;
    }else if (CMD_NAME === `sf`) {
		shuffle(message, serverQueue);
        return;
    }else if (CMD_NAME === `shuffle`) {
		shuffle(message, serverQueue);
        return;
    }else if(CMD_NAME === `join`){
        connect(message, serverQueue)
        return;
    }else if(CMD_NAME === `dc`){
        Disconnect(message, serverQueue)
        return;
    }else if(CMD_NAME === `disconnect`){
        Disconnect(message, serverQueue)
        return;
    }
});

async function execute(message, serverQueue) {
    const setting = await GUILD.findOne({
        guildId: message.guild.id
    })
    let PREFIX = setting.PREFIX;
    const user = message.author.tag
    const args = message.content.substring(PREFIX.length).split(' ');
    const searchString = args.slice(1).join(" ")
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : ''
    if(!args[1]) return message.channel.send(`You need to specify a music`)
	const voiceChannel = message.member.voice.channel;
	if (!voiceChannel) return message.channel.send('You need to be in a voice channel to play music!');
    const permissions = voiceChannel.permissionsFor(message.client.user);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send('I need the permissions to join and speak in your voice channel!');
    }
     if(url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)){
        const playList = await youtube.getPlaylist(url)
        const videos = await playList.getVideos()
        for(const video of Object.values(videos)){
            const video2 = await youtube.getVideoByID(video.id)
            await handleVideo(video2, message, voiceChannel, true)
        }
        const embed = new Discord.MessageEmbed()
        .setAuthor(`Playlist **${playList.title}** has been added to the queue | Requested by: ${message.author.username}`)
        .setColor('#ffd300')
        .setFooter(message.channel.name)
        .setTimestamp()
        message.channel.send(embed)
        return undefined
    }if (url.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
        query = url
          .replace(/(>|<)/gi, '')
          .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
        const id = query[2].split(/[^0-9a-z_\-]/i)[0];
        const video = await youtube.getVideoByID(id).catch(function() {
          message.channel.send('There was a problem getting the video you provided!');
          return;
        });
        // can be uncommented if you don't want the bot to play live streams
        if (video.raw.snippet.liveBroadcastContent === 'live') {
          return message.reply("I don't support live streams!");
        }
        // can be uncommented if you don't want the bot to play videos longer than 1 hour
        if (video.duration.hours !== 0) {
          return message.reply('I cannot play videos longer than 1 hour');
        }
        // // can be uncommented if you want to limit the queue
        // if (message.guild.musicData.queue.length > 10) {
        //   return message.say(
        //     'There are too many songs in the queue already, skip or wait a bit'
        //   );
        // }
          await handleVideo(video, message, voiceChannel)
          
        return undefined
      }else{
        try{
            var video = await youtube.getVideoByID(url)
        }catch{
            try{
                var videos = await youtube.searchVideos(searchString, 10)
                var index = 0
                const embed = new Discord.MessageEmbed()
                .setDescription(`__**Song Selection:**__\n${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n\n')}\n\n**Please select one of the songs ranging from 1-10**`)
        
                        message.channel.send(embed)
                        .then(msg => {
                            msg.delete({timeout: 10000}), message.delete({timeout: 10000})
                        })
                try{
                    var responce = await message.channel.awaitMessages(msg=> msg.content > 0 && msg.content <11, {
                        max: 1,
                        time: 10000,
                        errors: ['time']
                    })
                }catch{
                    const invalid = new Discord.MessageEmbed()
                    .setDescription('No or invalid song selection was provided')
                    .setColor('#ffd300')
                    .setTimestamp()
                    .setFooter(`${message.channel.name}`)
                    message.channel.send(invalid)
                }
                const videoIndex = parseInt(responce.first().content)
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id)
            }catch(error){
                const fail = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription('I couldnt find any search results')
                .setColor('#ffd300')
                .setFooter(`${message.channel.name}`)
                return message.channel.send(fail)
            }
        }
        return handleVideo(video, message, voiceChannel);
        // return undefined
    }
	// const songInfo = await ytdl.getInfo(args[1]);
	

}



function stop(message, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if(!serverQueue) return message.channel.send('There is nothing playing');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.destroy();
    const stopEmbed = new Discord.MessageEmbed()
    .setDescription(`The music has been stopped by **${message.member.displayName}**`)
    .setColor('#ffd300')
    .setTimestamp()
    .setFooter(`${message.channel.name}`);
	message.channel.send(stopEmbed)
		return undefined
}

function skip(message, serverQueue) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();

    const skipEmbed = new Discord.MessageEmbed()
    .setDescription(`The music has been skipped by **${message.member.displayName}**`)
    .setColor('#ffd300')
    .setTimestamp()
    .setFooter(`${message.channel.name}`)
    message.channel.send(skipEmbed);
    return undefined
}

function volume(message, serverQueue){
    const args = message.content.split(' ');
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use that music command")
    if(!serverQueue) return message.channel.send("There is nothing playing")
    if(!args[1]){ 
        const volumeEmbed = new Discord.MessageEmbed()
        .setDescription(`Current volume is **${serverQueue.volume}**`)
        .setColor('#ffd300')
        .setTimestamp()
        .setFooter(`${message.channel.name}`)
        return message.channel.send(volumeEmbed);
    }
    if(isNaN(args[1])) return message.channel.send("That is not a valid amount to change the volume to")
    serverQueue.volume = args[1]
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 200);

    const changeEmbed = new Discord.MessageEmbed()
    .setDescription(`The volume is changed to **${args[1]}** by **${message.member.displayName}**`)
    .setColor('#ffd300')
    .setTimestamp()
    .setFooter(`${message.channel.name}`)
    message.channel.send(changeEmbed);
    return undefined
}

function np(message, serverQueue){
    if(!serverQueue){ 
        const embedNothing = new Discord.MessageEmbed()
	.setColor('#ffd300')
	.setTitle(`There is nothing to play!`)
	// .setURL(`${serverQueue.songs[0].url}`)
	// .setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/maxresdefault.jpg`)
	.setTimestamp()
    .setFooter(message.channel.name);

        return message.channel.send(embedNothing).then(msg => {
            msg.delete({timeout: 10000}, message.delete({timeout: 10000}))
          })
    }else{
    const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#ffd300')
	.setTitle(`**${serverQueue.songs[0].title}**`)
	.setURL(`${serverQueue.songs[0].url}`)
	.setAuthor(`Now Playing - Requested by **${serverQueue.songs[0].name}**`)
	.setThumbnail(`https://img.youtube.com/vi/${serverQueue.songs[0].id}/maxresdefault.jpg`)
	.setTimestamp()
    .setFooter(message.channel.name);
    message.channel.send(exampleEmbed).then(message.delete({timeout: 10000}));
    }
    return undefined
}

async function queueList(message, serverQueue){
    if(!serverQueue) return message.channel.send("There is nothing playing")
    if(serverQueue.songs.length === 1) return message.channel.send('There is nothing song in queue')
    const player = queue.get(message.guild.id)
    if(player){
    var index = 0;
    
    const embeds = generateQueueEmbed(player.queue);
    const queueEmbed = await message.channel.send(`Current Page: ${index+1}/${embeds.length}`, embeds[index]);
    await queueEmbed.react('⬅️');
    await queueEmbed.react('➡️');
    await queueEmbed.react('❌')

    const filter = (reaction, user) => ['⬅️', '➡️','❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
    const collector = queueEmbed.createReactionCollector(filter);

    collector.on('collect', async (reaction, user)=>{
        if(reaction.emoji.name === '➡️'){
            if(index < embeds.length-1){
                index++;
                queueEmbed.edit(`Current Page: ${index+1}/${embeds.length}`, embeds[index]);
            }
        }else if(reaction.emoji.name === '⬅️'){
            if(index !== 0){
                --index;
                queueEmbed.edit(`Current Page: ${index+1}/${embeds.length}`, embeds[index]);
            }
        }else{
            collector.stop();
            await queueEmbed.delete();
        }
    })
    // console.log(embeds.length)
    // message.channel.send(embeds[0]);
}


function generateQueueEmbed(queues){
    const embeds = []
    let k = 10;
    for(let i =1; i < serverQueue.songs.length; i += 10){
        const current = serverQueue.songs.slice(i, k);
        let j = i;
        k += 10;
        // ${song.time.minutes}:${song.time.seconds}
    const info = current.map(song => `${j++}. [${song.title}](${song.url}) ${song.time} [${song.name}]`).join('\n')
    const embed = new Discord.MessageEmbed()
        .setDescription(`**[Now playing: ${serverQueue.songs[0].title}](${serverQueue.songs[0].url}) ${serverQueue.songs[0].time} [${serverQueue.songs[0].name}]**\n${info}`)
    const embeded = new Discord.MessageEmbed()
        .setDescription(`**[Now playing: ${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**`)
    if(serverQueue.songs === 1){
        console.log(serverQueue.songs.length)
        embeds.push(embeded)
    }else{  
    embeds.push(embed)
    }

        }
   
return embeds;
    }
}



function shuffle(message, serverQueue){
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if ( !serverQueue) {
      return message.reply('There is no song playing right now!');
    } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }

    // console.log(serverQueue.songs)

    if (serverQueue.songs.length <= 1)
      return message.reply('There are just 1 or less songs in queue');

    shuffleQueue(serverQueue.songs);

    const titleArray = [];
    serverQueue.songs.slice(0, 10).forEach(obj => {
      titleArray.push(obj.title);
    });
    var numOfEmbedFields = 10;
    if (titleArray.length < 10) numOfEmbedFields = titleArray.length;
    var queueEmbed = new Discord.MessageEmbed()
      .setColor('#ffd300')
      .setTitle(`The queue has been shuffled by **${message.member.displayName}**`)
      .setFooter(`${message.channel.name}`)
      .setTimestamp();
      for (let i = 1; i < numOfEmbedFields; i++) {
        queueEmbed.addField(`${i + 0}:`, `${titleArray[i]}`);
      }
    return message.reply(queueEmbed);

    function shuffleQueue(queue) {
        for (let i = serverQueue.songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [queue[i], queue[j]] = [queue[j], queue[i]];
          }
    }
  }

function Disconnect(message, serverQueue){

    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if(!message.guild.me.voice.channel){
        return message.reply('Im not in voice channel')
    }
    if (message.member.voice.channel !== message.guild.me.voice.channel) {
      message.reply(
        `You must be in the same voice channel as the bot's in order to use that!`
      );
      return;
    }
        message.member.voice.channel.leave()
        message.channel.send('Okayyyy okaayy! Im quit now!')
		queue.delete(message.guild.id)
        return;

}

function connect(message, serverQueue){
    var voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply('Join a channel and try again');

    if(message.guild.me.voice.channel){
        return message.reply('Im already on other voice channel')
    }else{
    message.member.voice.channel.join()
    .then(connection => console.log('Connected!'))
    .catch(console.error);
    }
    return;
}

function pause(message, serverQueue){
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the pause command")
    if(serverQueue && serverQueue.playing){
    serverQueue.playing = false
    serverQueue.connection.dispatcher.pause();
    const pauseEmbed = new Discord.MessageEmbed()
    .setColor('#ffd300')
    .setDescription(`The music has been paused by ${message.member.displayName}`)
    .setFooter(`${message.channel.name}`)
    .setTimestamp()
    return message.reply(pauseEmbed)
    
    }else{
    const alreadyEmbed = new Discord.MessageEmbed()
    .setColor('#ffd300')
    .setDescription(`The music is already paused`)
    .setFooter(`${message.channel.name}`)
    .setTimestamp()
        message.reply(alreadyEmbed)
    }
    return undefined
}

function resume(message, serverQueue){
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the resume command")
    if(serverQueue && !serverQueue.playing){
    serverQueue.playing = true
    serverQueue.connection.dispatcher.resume();
    const resumeEmbed = new Discord.MessageEmbed()
    .setDescription(`The music has been resumed by ${message.member.displayName}`)
    .setColor('#ffd300')
    .setFooter(`${message.channel.name}`)
    .setTimestamp()
    return message.reply(resumeEmbed)
    }else{
    const alreadyResume = new Discord.MessageEmbed()
    .setDescription(`The music is already resumed`)
    .setColor('#ffd300')
    .setFooter(`${message.channel.name}`)
    .setTimestamp()
            message.reply(alreadyResume)
        }
    // // never open this because WIP
    // if(!serverQueue) return message.channel.send("There is nothing playing");
    // if(serverQueue.playing) return message.channel.send("The music already playing");
    // serverQueue.playing = true
    // serverQueue.connection.dispatcher.resume()
    // message.reply("I have now resumed the music for you")
    // return undefined
}

function loop(message, serverQueue){
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the resume command")
    if(!serverQueue) return message.channel.send("There is nothing playing");

    serverQueue.loop = !serverQueue.loop

    const loopEmbed = new Discord.MessageEmbed()
    .setDescription(`I have now ${serverQueue.loop ? `**Enabled**` : `**Disabled**`} loop.`)
    .setTimestamp()
    .setFooter(`${message.channel.name}`)
    .setColor('ffd300   ')

    return message.channel.send(loopEmbed)
}
// // never open this because WIP 
// function loopQueue(message, serverQueue){
//     if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the resume command")
//     if(!serverQueue) return message.channel.send("There is nothing playing");
//     if (serverQueue.songs.length <= 1) {
//         message.channel.send(`I can't loop over an empty queue!`);
//         return;
//       }
//     const queue = message.guild.musicData.queue;
//     let newQueue = [];
//     for (let i = 0; i < numOfTimesToLoop; i++) {
//       newQueue = newQueue.concat(queue);
//     }
//     message.guild.musicData.queue = newQueue;
//     // prettier-ignore
//     message.channel.send(
//       `Looped the queue ${numOfTimesToLoop} ${
//         (numOfTimesToLoop == 1) ? 'time' : 'times'
//       }`
//     );
//     return;
//   }
// }

async function handleVideo(video, message, voiceChannel, playList = false){
    const serverQueue = queue.get(message.guild.id)
    let duration = formatDuration(video.duration);
    if (duration == '00:00') duration = 'Live Stream';
    
    const song = {
		// title: Util.escapeMarkdown(songInfo.videoDetails.title),
        // url: songInfo.videoDetails.video_url,
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        time: duration,
        name: message.member.displayName
	};
    function formatDuration(durationObj) {
    const duration = `${durationObj.hours ? (durationObj.hours + ':') : ''}${
      durationObj.minutes ? durationObj.minutes : '00'
    }:${
      (durationObj.seconds < 10)
        ? ('0' + durationObj.seconds)
        : (durationObj.seconds
        ? durationObj.seconds
        : '00')
    }`;
    return duration;
  }


	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 50,
            playing: true,
            loop: false,
            loopQueue: false,
            mentioning: message.member.displayName,
            channel: message.channel.name,
		};

        queue.set(message.guild.id, queueContruct);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0]);
		} catch (err) {
			console.log(err);
			queue.delete(message.guild.id);
			return message.channel.send(err);
		}
	} else {
        // console.log(serverQueue.songs);
        serverQueue.songs.push(song)
        if(playList){ 
            return undefined
        }else{
            const addedQueue = new Discord.MessageEmbed()
            .setDescription(`${song.title} has been added to the queue! - Requested by: **${song.name}**`)
            .setColor('#ffd300')
            .setTimestamp()
            .setFooter(serverQueue.channel)
             return message.channel.send(addedQueue);
        }
		
    }
    return undefined
}


function play(guild, song) {
    // var client = new Discord.TextChannel();
    const serverQueue = queue.get(guild.id);
    if (!song) {
        // serverQueue.voiceChannel.leave()
        // serverQueue.textChannel.send('Because there is nothing to play, i have to quit. Bye!')
		queue.delete(guild.id)
        return;
	}

    const dispatcher = serverQueue.connection.play(ytdl(song.url))
		.on('finish', () => {
            if(!serverQueue.loop) serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
			console.log('Music ended!');
		})
		.on('error', error => {
			console.error(error);
		});
    dispatcher.setVolumeLogarithmic(50 / 100)
    
    const exampleEmbed = new Discord.MessageEmbed()
    .setTitle(`${song.title}`)
    .setURL(`${song.url}`)
    .setAuthor(`Start Playing - Requested by ${song.name}`)
    .setColor('#ffd300')
	.setThumbnail(`https://img.youtube.com/vi/${song.id}/maxresdefault.jpg`)
    .setTimestamp()
    .setFooter(`${serverQueue.channel}`)


    serverQueue.textChannel.send(exampleEmbed)
    // .then(msg => {
    //     msg.delete({timeout: 10000})
    //   })
}

client.login(process.env.DISCORDJS_BOT_TOKEN);
