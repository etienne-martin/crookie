# Crookie
A slack bot that sends notifications whenever new cryptocurrency is added to Binance, Bithumb, Bitfinex, Bittrex, Polonyx, Bitstamp, GDAX, Huobi, Coinone and Hitbtc.

## Usage

1. Go on https://api.slack.com/apps and create a new slack app.
2. In the "Add features and functionality" dropdown, click on "Incoming Webhooks" and turn that feature ON.
3. Click on "Add New Webhook to Workspace" and select the channel where you want your notifications to be delivered.
4. Scroll down, copy the Webhook URL in your clipboard and keep it for later.
5. Open a terminal window to edit environment variables:

```bash
nano ~/.bash_profile
```

6. Add the Webhook URL to your `.bash_profile`:

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
```

7. Make sure your system loads in the new variables:

```bash
source ~/.bash_profile
```

8. Run `npm install` to install the dependencies.

9. Run the server with the following command: `node dist/index.js`.

## Built with

* [node.js](https://github.com/moment/moment) - Node.js is an open-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side.
* [slack](https://api.slack.com/apps) - Slack is a cloud-based set of proprietary team collaboration tools and services.
* [love](https://en.wikipedia.org/wiki/Love) - Love encompasses a variety of different emotional and mental states, typically strongly and positively experienced, ranging from the deepest interpersonal affection to the simplest pleasure.


## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Update the [README.md](https://github.com/etienne-martin/crookie/blob/master/README.md) with details of changes to the library.

Build the project and test all the features before submitting your pull request.

## Authors

* **Etienne Martin** - *Initial work* - [etiennemartin.ca](http://etiennemartin.ca/)
* **Alex Beauchemin** - *Improvements* - [@AlexBeauchemin](https://github.com/AlexBeauchemin)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/etienne-martin/crookie/blob/master/LICENSE) file for details.
