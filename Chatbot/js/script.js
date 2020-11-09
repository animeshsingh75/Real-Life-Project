onload = function() {
    var chat = {
        messageToSend: '',
        messageResponses: [
            'Why did the web developer leave the restaurant? Because of the table layout.',
            'How do you comfort a JavaScript bug? You console it.',
            'An SQL query enters a bar, approaches two tables and asks: "May I join you?"',
            'What is the most used language in programming? Profanity.',
            'What is the object-oriented way to become wealthy? Inheritance.',
            'An SEO expert walks into a bar, bars, pub, tavern, public house, Irish pub, drinks, beer, alcohol'
        ],
        init: async function() {
            this.chatTree = new ChatTree();
            await this.chatTree.init();
            this.cacheDOM();
            this.bindEvents();
            await this.render();
        },
        cacheDOM: function() {
            this.$chatHistory = $('.chat-history');
            this.$button = $('button');
            this.$textarea = $('#message-to-send');
            this.$chatHistoryList = this.$chatHistory.find('ul');
        },
        bindEvents: function() {
            this.$button.on('click', this.addMessage.bind(this));
            this.$textarea.on('keyup', this.addMessageEnter.bind(this));
        },
        render: async function() {
            this.scrollToBottom();
            if (this.messageToSend.trim() !== '') {
                var template = Handlebars.compile($("#message-template").html());
                var context = {
                    messageOutput: this.messageToSend,
                    time: this.getCurrentTime()
                };
                this.input = this.messageToSend;
                this.$chatHistoryList.append(template(context));
                this.scrollToBottom();
                this.$textarea.val('');
                var templateResponse = Handlebars.compile($("#message-response-template").html());
                var contextResponse = {
                    response: await this.chatTree.getMessage(this.input),
                    time: this.getCurrentTime()
                };
                setTimeout(function() {
                    this.$chatHistoryList.append(templateResponse(contextResponse));
                    this.scrollToBottom();
                }.bind(this), 1000);
            }
        },
        addMessage: function() {
            this.messageToSend = this.$textarea.val();
            this.render();
        },
        addMessageEnter: function(event) {
            if (event.keyCode === 13) {
                this.addMessage();
            }
        },
        scrollToBottom: function() {
            this.$chatHistory.scrollTop(this.$chatHistory[0].scrollHeight);
        },
        getCurrentTime: function() {
            return new Date().toLocaleTimeString().
            replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3");
        }
    };
    chat.init();
};

class ChatTree {
    constructor() {

    }
    async init() {
        const data = await this.reset();
        this.chat_tree = data;
        this.firstMsg = true;
        console.log("inside done");
        return "Chat has now been terminated. Send hi to begin chat again !";
    }
    async reset() {
        const response = await fetch('js/chat_tree.json');
        const jsonResponse = await response.json();
        return jsonResponse;
    }
    async getMessage(input) {
        let resp = '';
        if (this.firstMsg === true) {
            this.firstMsg = false;
            resp += "Hey there buddy<br>";
        } else {
            if (("message" in this.chat_tree) && (input.trim() === "Reset")) {
                return this.init();
            }
            if (parseInt(input) - 1 === this.chat_tree['children'].length) {
                return this.init();
            }
            if (isNaN(parseInt(input)) || parseInt(input) <= 0 || parseInt(input) > this.chat_tree['children'].length + 1)
                return 'It seems like you gave a wrong input ! Go ahead try again !';
            this.chat_tree = this.chat_tree['children'][parseInt(input) - 1];
        }
        if ("message" in this.chat_tree) {
            let data;
            if (this.chat_tree['type'] === "function") {
                if (this.chat_tree['message'] === "getJoke()") {
                    data = await eval(this.chat_tree['message']);
                    data = data.value.joke;
                } else if (this.chat_tree['message'] === "motivation()") {
                    data = await eval(this.chat_tree['message']);
                    let randnum = Math.floor(Math.random() * data.length);
                    data = "<blockquote><p>" + data[randnum].text + " </p></blockquote>" + "<cite>- " + data[randnum].author + "</cite>"
                } else {
                    data = await eval(this.chat_tree['message']);
                    let randnum = Math.floor(Math.random() * data.articles.length);
                    console.log(data.articles[0]);
                    data = "<a href='" + data.articles[randnum].url + "'target='_blank'>" + data.articles[randnum].title + "</a><br><br>" + "<img class='center' src='" +
                        data.articles[randnum].image + "'>" + "<br><a href='" + data.articles[randnum].source.url + "'target='_blank'><cite>-" + data.articles[randnum].source.name + "</cite></a>";
                }
            } else {
                data = this.chat_tree['message'];
            }
            resp += data;
            resp += "<br><br>Please input <b>Reset</b> to reset chat now";
        } else {
            for (let i in this.chat_tree['child_msg']) {
                resp += String(parseInt(i) + 1) + ". " + this.chat_tree['child_msg'][parseInt(i)] + "<br>";
            }
        }
        return resp;
    }
}
motivation();
async function getJoke() {
    const response = await fetch('https://api.icndb.com/jokes/random');
    const jsonResp = await response.json();
    return jsonResp;
}

async function getNewsIn() {
    const response = await fetch('https://gnews.io/api/v4/top-headlines?country=in&lang=en&pageSize=1&token=b28e3193c110763310d82930d4a3d05f');
    const jsonResp = await response.json();
    return jsonResp;
}
async function getNews() {
    const response = await fetch('https://gnews.io/api/v4/top-headlines?&lang=en&pageSize=1&token=b28e3193c110763310d82930d4a3d05f');
    const jsonResp = await response.json();
    return jsonResp;
}
async function motivation() {
    const response = await fetch('https://type.fit/api/quotes');
    const jsonResp = await response.json();

    return jsonResp;
}