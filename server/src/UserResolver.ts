import { compare, hash } from 'bcryptjs';
import { verify } from 'jsonwebtoken';
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
  accessToken: string;
  @Field(() => User)
  user: User;
}
@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return 'hi';
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(
    @Ctx() { payload }: MyContext
    ): string {
    console.log(payload);
    return `your user id is ${ payload!.userId }`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() context: MyContext) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      return User.findOne(payload.userId);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  
  //logout
  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: MyContext) {
    sendRefreshToken(res, ';')
    return true;
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
      accessToken: createAccessToken(user),
      user
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
