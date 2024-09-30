const Reply = require("../../../utils/models/reply.js");

module.exports = {
  dataSlash: {
    name: "add-reply",
    description: "reply",
    options: [
      {
        name: "start-with",
        description: "Choses Start",
        type: 3,
        required: true,
        choices: [
          {
            name: "prefix",
            value: "prefix",
          },
          {
            name: "No Prefix",
            value: "noPrefix",
          },
        ],
      },
      {
        name: "reply",
        description: "reply text",
        type: 3,
        required: true,
      },
      {
        name: "response",
        description: "response bot",
        type: 3,
        required: true,
      },
    ],
    run: async (client, interaction) => {
      const startWith = interaction.options.getString("start-with");
      const reply = interaction.options.getString("reply");
      const response = interaction.options.getString("response");

      const newReply = new Reply({
        startWith: startWith,
        reply: reply,
        response: response,
      });
      try {
        await newReply.save();
        await interaction.reply("Dona Add Reply Check now!");
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "error add reply i think this reply already here",
          ephemeral: true,
        });
      }
    },
  },
};
