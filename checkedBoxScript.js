const CheckedBoxModel = Backbone.Model.extend({
    defaults: {
      checked: 'true',
      htmlContent: 'checkbox'
    },
    onOff: function (){
      if (this.get('checked')){
        this.set({checked: false})
      } else {
        this.set({checked: true})
      }
    }
  });
  let firstButton = new CheckedBoxModel({});

  const CheckedBoxView = Backbone.View.extend({
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
    },
    render: function () {
      let checked = this.model.get('checked');
      let htmlContent = this.model.get('htmlContent');
      let html= `<div><input type="${htmlContent}" `;
      if (checked){
        html += `checked="${checked}" id="checkbox"></div><p>Jag är true</p>`;
      } else {
        html += `id="checkbox"></div><p>Jag är false</p>`;
      }
      $(this.el).html(html);
    },
    	events: {
  		"click #checkbox": 'onOff',
  	},
  	onOff: function() {
  		this.model.onOff();
  	}
  });

const CounterValue = Backbone.Model.extend({
  defaults: {
    displayValue: 0,
  },
  plus: function (){
    let oldValue= this.get('displayValue');
    this.set({displayValue: oldValue + 1})
  },
  minus: function (){
    let oldValue= this.get('displayValue');
    this.set({displayValue: oldValue - 1})
  }
});
let counterValue = new CounterValue({});

const CounterView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		let displayValue = this.model.get('displayValue');
		this.$el.html(`<p>${displayValue}</p>`);
  }
});

const ButtonView = Backbone.View.extend({
	initialize: function() {
		this.listenTo(this.model, 'change', this.render);
	},
	render: function() {
		let plusButton = `<button id="plusButton">+</button>`;
		let minusButton = `<button id="minusButton">-</button>`;
		let content = `${plusButton} ${minusButton}`;
		this.$el.html(content);
	},
	events: {
		"click #plusButton": 'plus',
		"click #minusButton": 'minus'
	},
	plus: function() {
		this.model.plus();
	},
	minus: function() {
		this.model.minus();
	}
});

const PasswordModel = Backbone.Model.extend({
  defaults: {
    correctPassword: 'katt',
    inputPassword: '',
  },
  checkPassword: function(){
    let input = $('#passwordField').val();
    this.set({inputPassword: input});
  }
});
let passwordModel = new PasswordModel({});

const PasswordView = Backbone.View.extend ({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function (){
    let passwordField = `<input type="password" id="passwordField"><button id="sendPassword">Skicka</button>`;
    let correctPassword = this.model.get('correctPassword');
    let inputPassword = this.model.get('inputPassword');
    let text = '';
    if (correctPassword === inputPassword){
      text = `<p id="correctPassword">Rätt lösenord</p>`;
    } else {
      text = `<p id="wrongPassword">Fel lösenord</p>`;
    }
    this.$el.html(`${passwordField}${text}`)
  },
  events: {
    "click #sendPassword": 'checkPassword'
  },
  checkPassword: function() {
    this.model.checkPassword();
  },
});

const IsItANumberModel = Backbone.Model.extend ({
  defaults:{
    numberSuggestion: '',
  },
  isItANumberFunction: function(){
    let input = $('#isItANumberField').val();
    input = Number(input);
    this.set({numberSuggestion: input})
  }
});
let isItANumber = new IsItANumberModel({});
const IsItANumberView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function (){
    let htmlInput = `<input type="text" id="isItANumberField"><button id="sendNumber">Skicka</button>`;
    let numberSuggestion = this.model.get('numberSuggestion');
    let text='';
    if ( isNaN(numberSuggestion) ){
      text=`<p>Inget giltligt nummer</p>`;
    }else{
      text=`<p>Detta är ett giltligt nummer!</p>`;
    }
    this.$el.html(`${htmlInput}${text}`);
  },
  events: {
    "click #sendNumber": 'numberFunction'
  },
  numberFunction: function() {
    this.model.isItANumberFunction();
  },
});

const CorrectLock = Backbone.Model.extend({
  defaults: {
    first: 23,
    second: 66,
    third: 87
  }
});
correctLock = new CorrectLock({});
const InputLock = Backbone.Model.extend({
  defaults: {
    first: 0,
    second: 0,
    third: 0,
    open: false,
  },
  model: correctLock,
  checkPassword: function(){
    let firstInput = parseInt($('#firstInput').val());
    let secondInput = parseInt($('#secondInput').val());
    let thirdInput = parseInt($('#thirdInput').val());
    this.set({first: firstInput});
    this.set({second: secondInput});
    this.set({third: thirdInput});
    let first = this.model.get('first');
    let second = this.model.get('second');
    let third = this.model.get('third');
    if (first === firstInput && second === secondInput && third === thirdInput){
      this.set({open: true});
    } else {
      this.set({open: false});
    }
  }
});
let inputLock = new InputLock({});

const LockView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },
  render: function(){
    let open = this.model.get('open');
    let welcome = `<p id="paragraphLock">Skriv in rätt tal för verifiering</p> <input type="text" id="firstInput"><input type="text" id="secondInput"><input type="text" id="thirdInput"></br><button id="verifyNumbersButton">Verifiera</button>`;
    let text = '';
    if (open === true){
      text = 'Rätt kod!';
    } else {
      text = 'Fel kod!';
    }
    this.$el.html(welcome+text);
  },
    events: {
    "click #verifyNumbersButton": 'lockFunction'
  },
  lockFunction: function() {
    this.model.checkPassword();
  },
});
$(document).ready(function(){
   let lockView = new LockView({
    el: '.lock',
    model: inputLock
  });
  lockView.render();
  

  let checkboxViewInstance = new CheckedBoxView({
    el: '#checkList',
    model: firstButton
  });
  checkboxViewInstance.render();

  let counterView = new CounterView({
    el: '.counterDisplay',
    model: counterValue,
  })
  counterView.render();

  let buttonModel = new ButtonView({
    el: '.counterButtons',
    model: counterValue,
  });
  buttonModel.render();

  let passwordRender = new PasswordView({
    el: '.passwordRender',
    model: passwordModel,
  });
passwordRender.render();
let isItANumberRender = new IsItANumberView({
  el: '.isItANumber',
  model: isItANumber,
});
isItANumberRender.render();
});
