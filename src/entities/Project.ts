import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";
import { Task } from "./Task";

@Entity("projects")
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.projects, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "owner_id" })
  owner!: User;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}
