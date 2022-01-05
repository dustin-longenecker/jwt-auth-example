import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("users")
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column("text")
    email: string;

    @Column("text")
    password: string;

}