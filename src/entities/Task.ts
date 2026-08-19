import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Project } from "./Project";
import { User } from "./User";
import { Tag } from "./Tag";

export enum TaskStatus {
  TODO = "todo",
  IN_PROGRESS = "in_progress",
  DONE = "done",
}

@Entity("tasks")
@Check(`"priority" BETWEEN 1 AND 5`)
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "enum",
    enum: TaskStatus,
  })
  status!: TaskStatus;

  @Column({ type: "integer" })
  priority!: number;

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project!: Project;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "assignee_id" })
  assignee!: User | null;

  @Column({
    name: "due_date",
    type: "date",
    nullable: true,
  })
  dueDate!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @ManyToMany(() => Tag, (tag) => tag.tasks)
  @JoinTable({
    name: "task_tags",
    joinColumn: {
      name: "task_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags!: Tag[];
}
