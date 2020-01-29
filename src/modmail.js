const Discord = require("discord.js");
const fs = require("fs");
const settings = JSON.parse(fs.readFileSync('./config.json'));
var delays = settings.delay * 1000;
var PREFIX = settings.prefix;
var bot = new Discord.Client();
var tickets = [];
bot.on("ready", () => {
    if (settings.game==="default") {
    bot.user.setGame("DM Me for help!");
    } else {
        bot.user.setGame(settings.game);
    }
    console.log(`Started bot as: ${bot.user.tag}!`);
});
const delay = new Set();
const delay2 = new Set();
bot.on("message", function(message) {
    if (message.author.equals(bot.user)) return;
	if (message.channel.type==="dm") {
		if (delay.has(message.author.id)) { return message.reply(":x: **Please wait, you are on cooldown. Please re-send the message.**"); }
		delay.add(message.author.id);
		setTimeout(() => {
  delay.delete(message.author.id);
}, delays);
		if (isNaN(tickets[message.author.id])) {tickets[message.author.id]=1;}
		if (tickets[message.author.id]==1){message.reply("Thank you for contacting Mod Mail, we will reach out to you as soon as possible.");}
		tickets[message.author.id]=0;	
		var attach="";
		const embed = new Discord.RichEmbed()
		.setTitle("ModMail")
		.setDescription(message.content+`\n\nReply with: ${PREFIX}reply `+message.author.id+` content\nClose the ticket with: ${PREFIX}close `+message.author.id)
		.setFooter("Message by: "+message.author.username,message.author.avatarURL)
		bot.channels.get(settings.chnid).send(embed);
		function att() {
		if (message.attachments.size>0) {
			message.attachments.forEach(attachment => {
			attach=attach+"\n"+attachment.url;
			});
			bot.channels.get(settings.chnid).send(attach);
		}
	}
		setTimeout(att,500);
	}
    if (!message.content.startsWith(PREFIX)) return;
	var args = message.content.substring(PREFIX.length).split(" ");
	if (message.channel.type==="dm") return;
    switch (args[0].toLowerCase()) {
		case "reply":
		try {
		if(!message.guild.member(message.author).hasPermission(`ADMINISTRATOR`)) { return; }
		if (!args[1]) { return message.reply(":x: **Please write a message!**"); }
		if (!args[2]) { return message.reply(":x: **Please write a message!**"); }
		if (delay2.has(message.author.id)) { return message.reply(":x: **Please wait, you are sending too much messages to a user.**"); }
		setTimeout(() => {
  delay2.delete(message.author.id); 
}, delays);
delay2.add(message.author.id);
		var user = args[1];
		var messagez = message.content.split(args[1]+" ")[1];
		bot.users.get(args[1]).send("**(MODERATOR) "+message.author.username+":** "+messagez);
		message.reply("Message sent to the user. Waiting for a response.");
		} catch(err) {
			message.reply(":x: **User does not exist!**");
			console.log(err);
		}
		break;
		case "close":
		if(!message.guild.member(message.author).hasPermission(`ADMINISTRATOR`)) { return; }
		if (args[1]) {
			try {
			bot.users.get(args[1]).send("Thank you for contacting our moderators! This ticket has been closed!");
			tickets[message.author.id]="no";
			message.reply("Ticket closed!");
			} catch (err) {
				message.reply(":x: **User does not exist!**");
			}
		} else {
			return message.reply(":x: **You must type the ID!**");
		}
		break;
	}
});

bot.login(settings.token);
