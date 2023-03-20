const Discord = require('discord.js');

class DiscordPaginator {
  constructor(pages, options = {}) {
    this.currentPage = 0;
    this.options = Object.assign({
      customId: 'paginator',
      customStyle: 'PRIMARY',
      customEmojis: {},
      customEmbeds: [],
      timeout: 60000
    }, options);
  }

  async createMessage(channel) {
    const pageEmbed = this.getPageEmbed();
    const message = await channel.send({ embeds: [pageEmbed], components: [this.createButtons()] });
    this.createButtonCollector(message);
  }

  createButtons() {
    if(this.options.customEmojis?.next && this.options.customEmojis?.previous) {
    const buttonRow = new Discord.MessageActionRow();
    const previousButton = new Discord.MessageButton()
      .setCustomId(`${this.options.customId}-previous`)
      .setEmoji(this.options.customEmojis.previous)
      .setStyle(this.options.customStyle)
      .setDisabled(this.currentPage === 0);
    const nextButton = new Discord.MessageButton()
      .setCustomId(`${this.options.customId}-next`)
      .setEmoji(this.options.customEmojis.next)
      .setStyle(this.options.customStyle)
      .setDisabled(this.currentPage === this.options.customEmbeds.length - 1);
    buttonRow.addComponents(previousButton, nextButton);
    return buttonRow;
    } else {
    const buttonRow = new Discord.MessageActionRow();
    const previousButton = new Discord.MessageButton()
      .setCustomId(`${this.options.customId}-previous`)
      .setLabel('Previous')
      .setStyle(this.options.customStyle)
      .setDisabled(this.currentPage === 0);
    const nextButton = new Discord.MessageButton()
      .setCustomId(`${this.options.customId}-next`)
      .setLabel('Next')
      .setStyle(this.options.customStyle)
      .setDisabled(this.currentPage === this.options.customEmbeds.length - 1);
    buttonRow.addComponents(previousButton, nextButton);
    return buttonRow;
    }
  }

  createButtonCollector(message) {
    const filter = (interaction) => {
      if (!interaction.isButton()) return false;
      if (interaction.customId.startsWith(`${this.options.customId}-`)) return true;
      return false;
    };

    const collector = message.createMessageComponentCollector({ filter, time: this.options.timeout });

    collector.on('collect', async (interaction) => {
      interaction.deferUpdate();
      const buttonId = interaction.customId.split('-')[1];
      if (buttonId === 'next') {
        this.currentPage++;
      } else if (buttonId === 'previous') {
        this.currentPage--;
      }
      const pageEmbed = this.getPageEmbed();
      const buttonRow = this.createButtons();
      await interaction.message.edit({ embeds: [pageEmbed], components: [buttonRow] });
    });
  }

  getPageEmbed() {
    const page = this.options.customEmbeds[this.currentPage];
    let pageEmbed;
    if (this.options.customEmbeds.length > 0) {
      pageEmbed = this.options.customEmbeds[this.currentPage];
    } else {
      pageEmbed = new Discord.MessageEmbed()
        .setColor('RED')
        .setTitle(`Page ${this.currentPage + 1}`)
        .setDescription(page.data.description);
    }
    return pageEmbed;
  }
}

module.exports.DiscordPaginator = DiscordPaginator;