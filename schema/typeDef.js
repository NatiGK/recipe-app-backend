const {gql} = require('apollo-server-express');
const typeDefs = gql`
    scalar DateTime
    scalar Upload
    enum FoodCategory{
        LUNCH
        DINNER
        SNACK
        DRINK
        ALL
        BREAKFAST
        DESSERT
    }
    input UserInput{
        name: String!
        avatar: String!
        email: String!
        password: String!
        passwordConfirm: String!
    }
    type User{
        name: String!,
        avatar: String!,
        email: String,
        _id: ID,
    }
    input StepInput{
        stepTitle:String!
        stepDescription: String!
        imgs: [String]
        exts: [String]
    }
    input PostRecipeInput{
        image: String!
        category: FoodCategory!
        title: String!
        description: String!
        prepTime: Int!
        cookTime: Int!
        servings: Int!
        ingredients: [String!]!
        method: [StepInput!]!
        ext: String!
    }
    type Recipe{
        _id: ID!
        pubDate: DateTime
        image: String
        userId: ID!
        postedBy:User!
        category:FoodCategory!
        title: String!
        description: String!
        ratingAverage: Float!
        ratingAmount: Int!
        prepTime: Int!
        cookTime: Int!
        servings: Int!
        ingredients: [String!]!
        method: [Step!]!
    }
    type Step{
        stepTitle:String!
        stepDescription: String!
        imgs:[String]
    }
    input FilterInput{
        category: FoodCategory
    }
    input FeaturesInput{
        sort: String
        pageSize: Int
        pageNumber: Int
        filter: FilterInput
    }
    type Query{
        allUsers:[User]
        allRecipes(features: FeaturesInput): [Recipe]
        totalRecipes: Int!
        recipe(_id: ID!): Recipe
    }
    type Mutation{
        postRecipe(recipe: PostRecipeInput!): Recipe
        signUp(user: UserInput!): User
        signIn(email: String!, password: String!): User
    }
`
exports.typeDef = typeDefs;  