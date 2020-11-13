onload = function() {
    var chat = {
        messageToSend: '',
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
            this.$leftside = $('#chatdiv2');
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
            if (("message" in this.chat_tree) && ((input.trim() === "Reset") || (input.trim() === "reset"))) {
                document.getElementById("chatdiv2").innerHTML = " <span style='width: 100%; text-align: center; font-size: x-large; padding: 40px'><b>Send a simple hello message to begin</b></span>";
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
                document.getElementById("chatdiv2").innerHTML = " <span style='width: 100%; text-align: center; font-size: x-large; padding: 40px'><b>Send a simple hello message to begin</b></span>";
                if (this.chat_tree['message'] === "getJoke()") {
                    data = await eval(this.chat_tree['message']);
                    data = data.value.joke;
                } else if (this.chat_tree['message'] === "motivation()") {
                    data = await eval(this.chat_tree['message']);
                    let randnum = Math.floor(Math.random() * data.length);
                    data = "<blockquote><p>" + data[randnum].text + " </p></blockquote>" + "<cite>- " + data[randnum].author + "</cite>"
                } else if (this.chat_tree['message'] === "getWeather()") {
                    data = await getWeather();
                    data = "<p>The location can also be inaccurate due to free API.So there can be a <span>  &#177 <span>5°C error</p>";
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




async function getJoke() {
    const response = await fetch('https://api.icndb.com/jokes/random');
    const jsonResp = await response.json();
    return jsonResp;
}

async function getNewsIn() {
    const response = await fetch('https://gnews.io/api/v4/top-headlines?country=in&lang=en&pageSize=1&token=b28e3193c110763310d82930d4a3d05f');
    const jsonResp = await response.json();
    console.log("in");
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

async function getWeather() {
    document.getElementById("chatdiv2").innerHTML = '<object type="text/html" data="weather.html" ></object>'
}