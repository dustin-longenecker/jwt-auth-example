import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { Arg, Mutation, Query, Resolver, ObjectType, Field, Ctx } from 'type-graphql';
import { User } from './entity/User';
import { MyContext } from './MyContext';



@ObjectType() 
class LoginResponse {
  @Field()
  accessToken: string
}
@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }

  @Query(() => [User])
  users() {
    return User.find();
  }
  //access token
  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('could not find user');
    }

    const valid = await compare(password, user.password);

    if(!valid){
      throw new Error('bad password');
    }

    //login successful

    //refresh token
    res.cookie(
     'jid',
     sign({ userId: user.id }, 'secret2', { expiresIn: '7d'} ),
     {
       httpOnly: true,
     }
    );
    //accessToken
    return {
      accessToken: sign({userId: user.id}, 'secret', {expiresIn: '15m'})
    }
  }


  //add user
  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<boolean> {
    const hashedPassword = await hash(password, 12);

    try {
      await User.insert({
        email,
        password: hashedPassword
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
  }
