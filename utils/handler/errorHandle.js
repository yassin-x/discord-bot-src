async function safeReply(message, content, ephemeral) {
  try {
    await message.reply({ content: content });
  } catch (error) {
    try {
      await message.channel.send({ content: content });
    } catch (err) {
      await message.channel.send({
        content: `Error sending fallback message: ${err}`,
      });
    }
  }
}

module.exports = {
  safeReply,
};
