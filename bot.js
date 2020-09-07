require('dotenv').config();
const { Client, MessageAttachment, Util } = require('discord.js');
// const DEFAULT_PREFIX =  require('./config.json')
const Discord = require('discord.js')
const ytdl = require('ytdl-core');
const db = require('quick.db')
const YouTube = require('simple-youtube-api');
const { codePointAt } = require('ffmpeg-static');
const client = new Client({disableEveryone: false});
// 
const queue = new Map();
const youtube = new YouTube(process.env.GOOGLE_API_KEY);


client.on('ready', ()=>{
    console.log(`${client.user.username} is Online`);
});

client.on('message', async (message)=>{
    let PREFIX;
    let prefixes = await db.fetch(`prefix_${message.guild.id}`)
    if(prefixes == null){
        PREFIX = "%"
    }else{
        PREFIX = prefixes
    }
    const gif = new MessageAttachment('https://media.giphy.com/media/H99r2HtnYs492/giphy.gif');
    const gif2 = new MessageAttachment('https://media.giphy.com/media/yJFeycRK2DB4c/giphy.gif')
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
        if(!message.member.hasPermission('KICK_MEMBERS'))
            return message.reply('You dont have permissions to use that command');
        
        if(args.length === 0) 
            return message.reply('Please provide an ID');
        
        const member = message.guild.member( message.mentions.users.first() || message.guild.members.cache.get(args[0]));
            if(member){
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
            const member = message.guild.member( message.mentions.users.first() || message.guild.members.cache.get(args[0]));
            if(member){
                member.ban()
                    .then((member) => message.reply('That user was banned', gif))
                    .catch((err) => message.channel.send('I cannot ban admin :('));
            }
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
        if(!args[0]) return message.channel.send("You need to specify a prefix")

        await db.set(`prefix_${message.guild.id}`, args[0])

        message.channel.send(`Prefix has been change to ${args[0]}`)

    }
  }
});

client.on('message', async message => {
    let PREFIX;
    let prefixes = await db.fetch(`prefix_${message.guild.id}`)
    if(prefixes == null){
        PREFIX = "%"
    }else{
        PREFIX = prefixes
    }
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;
	// const searchString = args.slice(1).join(' ')
    // const url = args[1] ? args[1].replace(/<(._)>/g, '$1') : ''
    const serverQueue = queue.get(message.guild.id);
    

	if (message.content.startsWith(`${PREFIX}play `)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${PREFIX}skip`)) {
		skip(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${PREFIX}stop`)) {
		stop(message, serverQueue);
		return;
	}else if (message.content.startsWith(`${PREFIX}p `)) {
		execute(message, serverQueue);
		return;
	} else if (message.content.startsWith(`${PREFIX}volume`)) {
		volume(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}pause`)) {
		pause(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}ps`)) {
		pause(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}resume`)) {
		resume(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}rs`)) {
		resume(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}np`)) {
		np(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}queue`)) {
		queueList(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}q`)) {
		queueList(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}loop`)) {
		loop(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}l`)) {
		loop(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}lp`)) {
		loop(message, serverQueue);
        return;
    }else if (message.content.startsWith(`${PREFIX}sf`)) {
		shuffle(message, serverQueue);
        return;
    }else if(message.content.startsWith(`${PREFIX}rm`||`${PREFIX}remove`)){
        remove(message, serverQueue);
        return;
    }
});

async function execute(message, serverQueue) {
    let PREFIX;
    let prefixes = await db.fetch(`prefix_${message.guild.id}`)
    if(prefixes == null){
        PREFIX = "%"
    }else{
        PREFIX = prefixes
    }
    const user = message.author.tag
    const args = message.content.substring(PREFIX.length).split(' ');
    const searchString = args.slice(1).join(" ")
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : ''
    
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
        message.channel.send(`Playlist **${playList.title}** has been added to the queue | Requested by: ${message.author}`)
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
                    .setFooter(`${serverQueue.channel}`)
                    message.channel.send(invalid)
                }
                const videoIndex = parseInt(responce.first().content)
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id)
            }catch(error){
                console.log(error)
                const fail = new Discord.MessageEmbed()
                .setTimestamp()
                .setDescription('I couldnt find any search results')
                .setColor('#ffd300')
                .setFooter(`${serverQueue.channel}`)
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
    serverQueue.connection.dispatcher.end();
    const stopEmbed = new Discord.MessageEmbed()
    .setDescription(`The music has been stopped by **${message.member.displayName}**`)
    .setColor('#ffd300')
    .setTimestamp()
    .setFooter(`${serverQueue.channel}`);
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
    .setFooter(`${serverQueue.channel}`)
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
        .setFooter(`${serverQueue.channel}`)
        return message.channel.send(volumeEmbed);
    }
    if(isNaN(args[1])) return message.channel.send("That is not a valid amount to change the volume to")
    serverQueue.volume = args[1]
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 200);

    const changeEmbed = new Discord.MessageEmbed()
    .setDescription(`The volume is changed to **${args[1]}** by **${message.member.displayName}**`)
    .setColor('#ffd300')
    .setTimestamp()
    .setFooter(`${serverQueue.channel}`)
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
    .setFooter(serverQueue.channel);

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
    const player = queue.get(message.guild.id)
    if(player){
    let currentPage = 0;
    
    const embeds = generateQueueEmbed(player.queue);
    const queueEmbed = await message.channel.send(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
    await queueEmbed.react('⬅️');
    await queueEmbed.react('➡️');
    await queueEmbed.react('❌')

    const filter = (reaction, user) => ['⬅️', '➡️','❌'].includes(reaction.emoji.name) && (message.author.id === user.id);
    const collector = queueEmbed.createReactionCollector(filter);

    collector.on('collect', async (reaction, user)=>{
        if(reaction.emoji.name === '➡️'){
            if(currentPage < embeds.length-1){
                currentPage++;
                queueEmbed.edit(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
            }
        }else if(reaction.emoji.name === '⬅️'){
            if(currentPage !== 0){
                --currentPage;
                queueEmbed.edit(`Current Page: ${currentPage+1}/${embeds.length}`, embeds[currentPage]);
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
    for(let i =0; i < serverQueue.songs.length; i += 10){
        const current = serverQueue.songs.slice(i, k);
        let j = i;
        k += 10;
        // ${song.time.minutes}:${song.time.seconds}
    const info = current.map(song => `${++j}. [${song.title}](${song.url}) [**${song.name}**]`).join('\n')
    const embed = new Discord.MessageEmbed()
        .setDescription(`**[Now playing: ${serverQueue.songs[0].title}](${serverQueue.songs[0].url})**\n${info}`)
    embeds.push(embed)


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
      .setFooter(`${serverQueue.channel}`)
      .setTimestamp();
      for (let i = 0; i < numOfEmbedFields; i++) {
        queueEmbed.addField(`${i + 1}:`, `${titleArray[i]}`);
      }
    return message.reply(queueEmbed);

    function shuffleQueue(queue) {
        for (let i = serverQueue.songs.length - 1; i > 1; i--) {
            let j = 1 + Math.floor(Math.random() * i);
            [queue[i], queue[j]] = [queue[j], queue[i]];
          }
    }
  }


function remove(message, serverQueue){
    if (serverQueue < 1 && serverQueue >= serverQueue.songs.length) {
        return message.reply('Please enter a valid song number');
      }
      var voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.reply('Join a channel and try again');
  
      if (!serverQueue) {
        return message.reply('There is no song playing right now!');
      } else if (voiceChannel.id !== message.guild.me.voice.channel.id) {
        message.reply(
          `You must be in the same voice channel as the bot's in order to use that!`
        );
        return;
      }
  
      serverQueue.songs.slice(serverQueue - 1, 1);
    //   return message.reply(`Removed song number ${serverQueue} from queue`);
    }

 

function pause(message, serverQueue){
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the pause command")
    if(serverQueue && serverQueue.playing){
    serverQueue.playing = false
    serverQueue.connection.dispatcher.pause();
    const pauseEmbed = new Discord.MessageEmbed()
    .setColor('#ffd300')
    .setDescription(`The music has been paused by ${message.member.displayName}`)
    .setFooter(`${serverQueue.channel}`)
    .setTimestamp()
    return message.reply(pauseEmbed)
    }else{
    const alreadyEmbed = new Discord.MessageEmbed()
    .setColor('#ffd300')
    .setDescription(`The music is already paused`)
    .setFooter(`${serverQueue.channel}`)
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
    .setFooter(`${serverQueue.channel}`)
    .setTimestamp()
    return message.reply(resumeEmbed)
    }else{
    const alreadyResume = new Discord.MessageEmbed()
    .setDescription(`The music is already resumed`)
    .setColor('#ffd300')
    .setFooter(`${serverQueue.channel}`)
    .setTimestamp()
            message.reply(alreadyResume)
        }
    
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
    .setFooter(`${serverQueue.channel}`)
    .setColor('ffd300   ')

    return message.channel.send(loopEmbed)
}

async function handleVideo(video, message, voiceChannel, playList = false){
    const serverQueue = queue.get(message.guild.id)
    const song = {
		// title: Util.escapeMarkdown(songInfo.videoDetails.title),
        // url: songInfo.videoDetails.video_url,
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        time: video.duration,
        name: message.member.displayName
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 50,
            playing: true,
            loop: false,
            mentioning: message.member.displayName,
            channel: message.channel.name,
		};

        queue.set(message.guild.id, queueContruct,message.member.displayName);

		queueContruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueContruct.connection = connection;
			play(message.guild, queueContruct.songs[0], message.member.displayName);
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
        serverQueue.voiceChannel.leave()
        serverQueue.textChannel.send('Because there is nothing to play, i have to quit. Bye!')
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
