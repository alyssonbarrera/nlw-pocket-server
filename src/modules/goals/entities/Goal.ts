import { Entity } from "@/core/entities/Entity";
import type { Optional } from "@/core/types/optional";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";

export type GoalProps = {
  id?: UniqueEntityID;
  title: string;
  completionCount?: number;
  desiredWeeklyFrequency: number;
  createdAt: Date;
};

type GoalOptionalProps = Optional<GoalProps, "id">;

export class Goal extends Entity<GoalProps> {
  get title() {
    return this.props.title;
  }

  get desiredWeeklyFrequency() {
    return this.props.desiredWeeklyFrequency;
  }

  get completionCount() {
    return this.props.completionCount;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  public static create(props: GoalOptionalProps, id?: UniqueEntityID) {
    return new Goal(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
