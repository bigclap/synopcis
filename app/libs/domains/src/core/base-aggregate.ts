import { AggregateRoot, DomainEvent, Identifier } from './types';

export abstract class BaseAggregate<
  TId extends Identifier,
  TProps,
  TEvent extends DomainEvent,
> implements AggregateRoot<TId, TProps, TEvent>
{
  protected readonly pendingEvents: TEvent[] = [];

  protected constructor(
    public readonly id: TId,
    public props: TProps,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public version: number,
  ) {}

  get changes(): readonly TEvent[] {
    return this.pendingEvents;
  }

  protected abstract apply(event: TEvent): void;

  protected record(event: TEvent): void {
    this.apply(event);
    this.pendingEvents.push(event);
    this.touch();
  }

  protected touch(): void {
    this.updatedAt = new Date();
  }

  clearChanges(): void {
    this.pendingEvents.length = 0;
  }
}
