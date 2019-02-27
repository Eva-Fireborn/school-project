
const animals = [
    {name: 'Göran', species: 'bird', price: 500},
    {name: 'Elsa', species: 'lizzard', price: 300},
    {name: 'Helge', species: 'shark', price: 1500},
    {name: 'Louise', species: 'cat', price: 2}
];
const AnimalModel = Backbone.Model.extend({
    defaults: {
        name: '',
        species: '',
        price: 0,
        editMode: false
    }
});

const AnimalCollection = Backbone.Collection.extend({
	model: AnimalModel
});
let animalCollection = new AnimalCollection(animals);

const AnimalView = Backbone.View.extend({
    tag: 'li',
    initialize: function () {
        this.listenTo(this.model, 'change', this.render);
    },
    render: function (){
        let editMode = this.model.get('editMode');
        let text;
        let name = this.model.get('name');
        let species = this.model.get('species');
        let price = this.model.get('price');
        let removeButton = '<button id="removeButton">Remove</button>';
        let editButton = '<button id="editButton">Edit</button>';
        let nameForm = `<input type="text" id="changeNameForm" value="${name}">`;
        let speciesForm = `<input type="text" id="changeSpeciesForm" value="${species}">`;
        let priceForm = `<input type="text" id="changePriceForm" value="${price}">`;
        let okButton = '<button id="okButton">Ok</button>';
        if (editMode){
            text = `${nameForm} is a ${speciesForm} who costs ${priceForm} dollars. ${okButton}${removeButton}`;
        } else {
            text = `${name} is a ${species} who costs ${price} dollars. ${editButton}${removeButton}`;
        }
        this.$el.html(text);
    },
    events: {
        "click #removeButton": 'remove',
        "click #editButton": 'edit',
        "click #okButton": 'okEdit',
    },
    remove: function(){
        animalCollection.remove(this.model);
    },
    edit: function(){
        this.model.set({editMode: true})
    },
    okEdit: function(){
        let newName = $('#changeNameForm').val();
        let newSpecies = $('#changeSpeciesForm').val();
        let newPrice = $('#changePriceForm').val();
        this.model.set({name: newName, species: newSpecies, price: newPrice, editMode: false})
    }
});

const AnimalListView = Backbone.View.extend({
    initialize: function() {
		this.listenTo(this.collection, 'update', this.render);
		this.listenTo(this.collection, 'change', this.render);
	},
    render: function() {
        let el = this.$el;
        el.html('');
        this.collection.forEach(function(animal) {
			let animalView = new AnimalView({ model: animal });
			animalView.render();
			el.append(animalView.$el);
        });
        let form = `<h2>Lägg till ett djur</h2>
        <input type="text" id="newAnimalName" placeholder='Name'>
        <input type="text" id="newAnimalSpecies" placeholder='Species'>
        <input type="text" id="newAnimalPrice" placeholder='Price'>
        <button id="addNewAnimalButton">Add</button>`;
        el.append(form);
    },
    events: {
        "click #addNewAnimalButton": 'add'
    },
    add: function () {
        let name = $('#newAnimalName').val();
        let species = $('#newAnimalSpecies').val();
        let price = $('#newAnimalPrice').val();
        let newAnimal = {
            name: name,
            species: species,
            price: price
        };
        animalCollection.add(newAnimal);
    }
});
$(document).ready(function(){
    let animalListView = new AnimalListView({
        collection: animalCollection,
        el: '#listOfAnimals'
    });
    animalListView.render();


});