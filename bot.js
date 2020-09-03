require('dotenv').config();
const { Client, Message, MessageAttachment, Util } = require('discord.js');
const ytdl = require('ytdl-core');
const YouTube = require('simple-youtube-api');
const { Video } = require('simple-youtube-api');
const client = new Client();
const PREFIX = "%";
const queue = new Map();
const youtube = new YouTube(process.env.GOOGLE_API_KEY)


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
    }
  }
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.split(' ');
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
    }else if (message.content.startsWith(`${PREFIX}r`)) {
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
    }else {
		message.channel.send('You need to enter a valid command!')
	}
});

async function execute(message, serverQueue) {
    const args = message.content.split(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : ''
    const searchString = args.slice(1).join(' ')

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
        message.channel.send(`Playlist **${playList.title}** has been added to the queue`)
        return undefined
    }else{
        try{
            var video = await youtube.getVideoByID(url)
        }catch{
            try{
                var videos = await youtube.searchVideos(searchString, 10)
                var index = 0
                message.channel.send(`
__**Song Selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}

Please select one of the songs ranging from 1-10
                `)
                try{
                    var responce = await message.channel.awaitMessages(msg=> msg.content > 0 && msg.content <11, {
                        max: 1,
                        time: 30000,
                        errors: ['time']
                    })
                }catch{
                    message.channel.send('No or invalid song selection was provided')
                }
                const videoIndex = parseInt(responce.first().content)
                var video = await youtube.getVideoByID(videos[videoIndex - 1].id)
            }catch{
                return message.channel.send("I couldnt find any search results")
            }
        }
        return handleVideo(video, message, voiceChannel);
    }
	// const songInfo = await ytdl.getInfo(args[1]);
	return undefined

}

function stop(message, serverQueue) {
    if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if(!serverQueue) return message.channel.send('There is nothing playing');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
	message.channel.send('I have stoped the music for you')
		return undefined
}

function skip(message, serverQueue) {
	if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
	if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
    message.channel.send("I have skipped the music for you");
    return undefined
}

function volume(message, serverQueue){
    const args = message.content.split(' ');
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use that music command")
    if(!serverQueue) return message.channel.send("There is nothing playing")
    if(!args[1]) return message.channel.send(`That volume is **${serverQueue.volume}**`);
    if(isNaN(args[1])) return message.channel.send("That is not a valid amount to change the volume to")
    serverQueue.volume = args[1]
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
    message.channel.send(`I have changed the volume to: **${args[1]}**`);
    return undefined
}

function np(message, serverQueue){
    if(!serverQueue) return message.reply("There is nothing playing");
    message.channel.send(`Now Playing **${serverQueue.songs[0].title}**`);
    return undefined
}

function queueList(message, serverQueue){
    if(!serverQueue) return message.channel.send("There is nothing playing")
    message.channel.send(`
__**Song Queue:**__
${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}

**Now Playing:** ${serverQueue.songs[0].title}
    `, { split: true })
    return undefined
}

function pause(message, serverQueue){
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the pause command")
    if(serverQueue && serverQueue.playing){
    serverQueue.playing = false
    serverQueue.connection.dispatcher.pause();
    return message.reply("I have now paused the music for you")
    }else{
        message.reply("The music is already paused")
    }
    return undefined
}

function resume(message, serverQueue){
    if(!message.member.voice.channel) return message.reply("You need to be in a voice channel to use the resume command")
    if(serverQueue && !serverQueue.playing){
    serverQueue.playing = true
    serverQueue.connection.dispatcher.resume();
    return message.reply("I have now resumed the music for you")
    }else{
            message.reply("The music is already resumed")
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

    return message.channel.send(`I have now ${serverQueue.loop ? `**Enabled**` : `**Disabled**`} loop.`)
}

async function handleVideo(video, message, voiceChannel, playList = false){
    const serverQueue = queue.get(message.guild.id)
    const song = {
		// title: Util.escapeMarkdown(songInfo.videoDetails.title),
        // url: songInfo.videoDetails.video_url,
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
	};

	if (!serverQueue) {
		const queueContruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
            playing: true,
            loop: false,
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
        if(playList) return undefined
        else return message.channel.send(`${song.title} has been added to the queue!`);
		
		
    }
    return undefined
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    
    
    if (!song) {
        serverQueue.voiceChannel.leave()
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
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);


    serverQueue.textChannel.send(`Start Playing: **${song.title}**`)
}

client.login(process.env.DISCORDJS_BOT_TOKEN);
