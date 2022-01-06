import { compare, hash } from 'bcryptjs';
import { Arg, Mutation, Query, Resolver, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql';
import { getConnection } from 'typeorm';
import { createAccessToken, createRefreshToken } from './auth';
import { User } from './entity/User';
import { isAuth } from './isAuth';
import { MyContext } from './MyContext';
import { sendRefreshToken } from './sendRefreshToken';



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

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: MyContext): string {
    console.log(payload);
    return `your user id is ${ payload!.userId }`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }
  
  //revoke access token
  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(
    @Arg('uerId', () => Int) userId: number, 
  ) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    
    return true;
  }

  //login -> create access token
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
    sendRefreshToken(res, createRefreshToken(user));
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
