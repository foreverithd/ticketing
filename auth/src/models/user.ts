import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the props
// that are required to create a new User
interface UserAttrs {
    email: string,
    password: string,
};

// An interface that describes the properties
// that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
};

const userType = {
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
};

const userSchema = new mongoose.Schema(userType, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret.password;
            delete ret._id;
            delete ret.__v;
        },
    }
});

// mongoose middlware code to execute before saving
// defining as function to access this property of the mongoose pre save 
// existing functions like 'isModified'
userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }

    done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };