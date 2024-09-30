const { Events } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  execute: async (message) => {
    if (message.content.startsWith("==")) {
      message.channel.send({
        content: [
          `Line :`,
          `https://media.discordapp.net/attachments/801979272687910954/1230006023495094342/line.png?ex=6631bf60&is=661f4a60&hm=37f36c73307e531d600a43bd76a79538bab4e6fdfddbcdf5a32ffc68e7ca2496&=&format=webp&quality=lossless`,
        ].join("\n"),
      });
      setTimeout(() => {
        message.delete();
      }, 3000);
    }
  },
};
