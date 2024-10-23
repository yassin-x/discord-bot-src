const Users = require("../../../utils/models/blacklist.js");

module.exports = {
  dataCommand: {
    name: "register",
    aliases: ["reg"],
    perms: { member: "ManageMessages", bot: "ManageMessages" },
    description: "Register a new user",
    run: async (client, message) => {
      const user = new Users({
        id: message.author.id,
        user: message.author.username,
      });

      try {
        await user.save();
        message.channel.send("User registered successfully!");
      } catch (error) {
        message.channel.send("An error occurred while registering the user.");
      }
    },
  },
  dataSlash: {
    name: "register",
    description: "Register a new user",
    perms: { bot: "ManageMessages" },
    options: [
      {
        name: "user",
        description: "Select User",
        type: 6,
        required: true,
      },
    ],
    run: async (client, interaction) => {
      const target = interaction.options.getUser("user");
      const newUser = new Users({
        id: target.id,
        user: target.tag,
      });
      try {
        await newUser.save();
        await interaction.reply("User registered successfully!");
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "An error occurred while registering the user.",
          ephemeral: true,
        });
      }
    },
  },
};
