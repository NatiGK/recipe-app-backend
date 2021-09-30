const mongoose = require('mongoose');
const validator = require('mongoose');


const recipeSchema = mongoose.Schema({
    pubDate: {
        type: Date,
        required: [true, 'The date field is required'],
        default: Date.now()
    },
    image:{
        type: String,
        required: [true,"The path of the image is reuired!"]
    },
    userId: {
        type: String,
        required: [true, 'Please include the user\'s id']
    },
    category: {
        type: String,
        enum: ['LUNCH', 'DINNER', 'SNACK', 'DRINK', 'ALL', 'ALL', 'BREAK_FAST', 'APPETIZER'],
        required: [true, 'Please provide the category field.']
    },
    title: {
        type: String,
        required: [true, 'Please provide the title']
    },
    description: {
        type: String,
        min: [15, 'The description must be more than 15 characters']
    },
    ratingAverage: {
        type: Number,
        max: [5, 'Rating average can\'t be more than 5']
    },
    ratingAmount: {
        type: Number,
        default: 0
    },
    prepTime: {
        type: Number,
        required: [true, 'Please provide the prep time.']
    },
    cookTime: {
        type: Number,
        required: [true, 'Please provide the cook time']
    },
    servings: {
        type: Number,
        required: [true, 'Please provide the amount of servings']
    },
    ingredients: {
        type: [String],
        required: [true, 'Please provide some ingredients.']
    },
    method: [{
        stepTitle: {
            type: String,
            required: [true, 'Please provide the title of the step']
        },
        stepDescription: {
            type: String,
            min: [15, 'The step description must be more than 15 characters']
        },
        imgs: [String]
    }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;