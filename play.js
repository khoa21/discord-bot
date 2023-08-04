const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports =
{
    name:'play',
    description:'play utube',
    async execute(message, args)
    {
        const voiceChannel = message.member.voice.channel;
        if(!args.length)
        {
            return message.channel.send('???')
        }
        if (!voiceChannel)
        {
            return message.channel.send('y u cribless dawg');
        }
        const permission = voiceChannel.permissionFor(message.client.user);
        if (!permission.has('CONNECT'))
        {
            return message.channel.send('maidenless tarnished zzz...');
        }
        if (!permission.has('SPEAK'))
        {
            return message.channel.send('why cant u talk buddy');
        }

        const connection = await voiceChannel.join();
        const fetchVid = async (query) => 
        {
            const res = await ytSearch(query);
            return (res.videos.length > 1)?res.videos[0]:null;
        }

        const vid = await fetchVid(args.join(''));

        if(vid)
        {
            const stream = ytdl(vid.url, {filter:'audioonly'});
            connection.play(stream, {seek:0, volume: 1}).on('finish', ()=>{
                voiceChannel.exit();
            });

            await message.reply(`playin now ***${vid.title}***`)
        }
        else
        {
            message.channel.send('eeeeeeeeeeeeeeeeeeeeeeeeeeeee!!!!!!!');
        }

    }
}