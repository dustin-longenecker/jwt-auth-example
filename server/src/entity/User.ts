import { Field, Int, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id: number;

    @Field(() => String)
    @Column("text")
    email: string;

    @Field(() => String)
    @Column("text")
    password: string;

    @Field(() => String)
    @Column("int", { default: 0 })
    tokenVersion: number;
}