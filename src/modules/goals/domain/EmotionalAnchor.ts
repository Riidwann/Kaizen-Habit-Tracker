import { ValueObject } from "@/shared/domain/ValueObject";
import { Result } from "@/shared/domain/Result";

export interface EmotionalAnchorProps {
  whyText: string;
}

export class EmotionalAnchor extends ValueObject<EmotionalAnchorProps> {
  private constructor(props: EmotionalAnchorProps) {
    super(props);
  }

  public static create(whyText: string): Result<EmotionalAnchor, string> {
    if (!whyText || whyText.trim().length === 0) {
      return Result.err("Emotional anchor (why statement) cannot be empty");
    }

    return Result.ok(new EmotionalAnchor({ whyText: whyText.trim() }));
  }

  public get whyText(): string {
    return this.props.whyText;
  }

  public toString(): string {
    return this.props.whyText;
  }
}
