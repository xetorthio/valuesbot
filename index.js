const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const message_payload = {
	"blocks": [
		{
			"type": "divider"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Elegí el/la lemoner que te gustaría reconocer"
			},
			"accessory": {
				"type": "users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a user",
					"emoji": true
				},
				"action_id": "recognized_user"
			},
            "block_id": "recognized_user"
		},
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "Elegí el valor por el cual te gustaría reconocerlo/a"
			},
			"accessory": {
				"type": "static_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a value",
					"emoji": true
				},
				"options": [
					{
						"text": {
							"type": "plain_text",
							"text": "We are smart",
							"emoji": true
						},
						"value": "we-are-smart"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "We are humble",
							"emoji": true
						},
						"value": "we-are-humble"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "We are liquid",
							"emoji": true
						},
						"value": "we-are-liquid"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "We act with integrity",
							"emoji": true
						},
						"value": "we-act-with-integrity"
					},
					{
						"text": {
							"type": "plain_text",
							"text": "We are here for a mission",
							"emoji": true
						},
						"value": "we-are-here-for-a-mission"
					}
				],
				"action_id": "recognized_value"
			},
            "block_id": "recognized_value"
		},
		{
			"type": "input",
			"element": {
				"type": "plain_text_input",
				"action_id": "recognized_action"
			},
			"label": {
				"type": "plain_text",
				"text": "Contanos por qué estás reconociendo este/a lemoner y en cuál acción viste reflejado este valor",
				"emoji": true
			},
            "block_id": "recognized_action"
		},
		{
			"type": "actions",
			"elements": [
				{
					"type": "button",
					"text": {
						"type": "plain_text",
						"text": "Recognize",
						"emoji": true
					},
					"value": "click_me_123",
					"action_id": "actionId-0"
				}
			]
		},
		{
			"type": "divider"
		}
	]
};

const channelID = 'C055UFAR94Y';
const token = 'xoxb-775281871926-5198272843904-HgCckJ0AnVOHuqMU3NNVFpzb';

app.post('/command', async (req, res) => {
  const { response_url } = req.body;

  await axios.post(response_url, message_payload);
  
  await res.status(200).end();
});

app.post('/action', async (req, res) => {
    const payload = JSON.parse(req.body.payload);
    console.log(payload.state.values.recognized_value.recognized_value);
    const recognition = {
        from: payload.user.id,
        to: payload.state.values.recognized_user.recognized_user.selected_user,
        value: payload.state.values.recognized_value.recognized_value.selected_option.text.text,
        because: payload.state.values.recognized_action.recognized_action.value
    }
    
    try {        
        const sres = await axios.post('https://slack.com/api/chat.postMessage', {
            channel: channelID,
			mrkdwn: true,
            text: `<@${recognition.from}> reconoció a <@${recognition.to}> por el valor *${recognition.value}*: "${recognition.because}"`
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(sres.status);
    } catch(ex) {
        console.log(ex);
    }

    await res.status(200).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));