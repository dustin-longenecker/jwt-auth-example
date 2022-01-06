import { compare, hash } from 'bcryptjs';
import { Arg, Mutation, Query, Resolver, ObjectType, Field, Ctx } from 'type-graphql';
import { createAccessToken, createRefreshToken } from './auth';
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
     createRefreshToken(user),
     {
       httpOnly: true,
     }
    );
    //accessToken
    return {
      accessToken: createAccessToken(user)
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
