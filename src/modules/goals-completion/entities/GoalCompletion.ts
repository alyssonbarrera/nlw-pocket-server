import { Entity } from "@/core/entities/Entity";
import type { UniqueEntityID } from "@/core/entities/unique-entity-id";
import type { Optional } from "@/core/types/optional";

export type GoalCompletionProps = {
  id?: UniqueEntityID;
  goalId: UniqueEntityID;
  createdAt?: Date;
};

type GoalCompletionOptionalProps = Optional<GoalCompletionProps, "id">;

export class GoalCompletion extends Entity<GoalCompletionProps> {
  get goalId() {
    return this.props.goalId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  public static create(
    props: GoalCompletionOptionalProps,
    id?: UniqueEntityID
  ) {
    return new GoalCompletion(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    );
  }
}
