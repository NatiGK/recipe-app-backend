const { GraphQLScalarType } = require('graphql');
const Recipe = require('./../models/RecipeModel');
const User = require('./../models/UserModel');
const {finished} = require('stream/promises');
const uploadFile = require('./../utils/uploadFile');
const {
    GraphQLUpload
} = require('graphql-upload');
var crypto = require('crypto');
const path = require('path');


exports.resolvers = {
    Upload: GraphQLUpload,
    Query:{
        totalRecipes: async () => {
            return await Recipe.estimatedDocumentCount();
        },
        allRecipes: async (parent,args) => {
            let allRecipes = Recipe.find();
            if(!(args.features===null)){
                
                if(args.features.sort){
                    allRecipes = allRecipes.sort(args.features.sort)
                }
                if(args.features.filter){
                    allRecipes.where(args.features.filter);
                }
                if(args.features.pageSize&& args.features.pageNumber){
                    const skip = (args.features.pageNumber-1)*args.features.pageSize;
                    allRecipes.skip(skip).limit(args.features.pageSize);    
                }
            }
            
            allRecipe = await allRecipes.exec();
            return allRecipes;
        },
        allUsers: async ()=>{
            const allUsers = await User.find({});
            return allUsers;
        },
        recipe: async (parent, args)=>{
            const recipe = await Recipe.findOne({_id: args._id});
            return recipe;
        }
    },
    Mutation:{
        postRecipe: async (parent, args)=>{
            let recipe = args.recipe;
            let toPath;
            let imgsCount = 0;
            let count = 0;
            let image = await uploadFile(
                recipe.image,
                recipe.ext,
                -1,
                -1
            );
            recipe.image = image;
            while(count<recipe.method.length){
                while(imgsCount<recipe.method[count].imgs.length){
                    toPath = await uploadFile(
                        recipe.method[count].imgs[imgsCount],
                        recipe.method[count].exts[imgsCount],
                        count, imgsCount
                    );
                    recipe.method[count].imgs[imgsCount] = toPath;
                    imgsCount++;
                }
                imgsCount = 0;
                count++;
            } 
            recipe = {
                ...recipe,
                ratingAverage:1,
                ratingAmount:1,
                pubDate: new Date(),
                userId:"6102b0e30b3cd44a28f4324f"
            }
            let newRecipe;
            try{
                 newRecipe = await Recipe.create(recipe);
            }catch(error){
                console.log(error);
            }
            return newRecipe;
        },
        signUp: async(parent, args)=>{
            if(!(args.user.password === args.user.passwordConfirm)){
                //return error
                return null
            }
            args.user.salt = crypto.randomBytes(16).toString('hex');
            args.user.hash = await crypto.pbkdf2Sync(
                args.user.password,
                args.user.salt,
                1000,
                64,
                'sha512'
            ).toString('hex');
            //use try catch
            const newUser = await User.create(args.user);
            return newUser; 
        },
        signIn: async(parent, args)=>{
            const user = await User.findOne({email: args.email}).exec();
            if(user===null) return null;
            let hash = await crypto.pbkdf2Sync(
                args.password,
                user.salt,
                1000,
                64,
                'sha512'
            ).toString('hex');
            if(!(user.hash === hash)){
                return null;
            }

            return user;
        }
    },
    Recipe:{
        postedBy: async (parent)=>{
            const user = await User.findOne({_id: parent.userId}).exec();
            if(!user) return null;
            return user;
        }
    },
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A valid date time value',
        parseValue: value=> new Date(value),
        serialize: value=> new Date(value).toString(),
        parseLiteral: ast => ast.value
    })
}

exports = this.resolvers;