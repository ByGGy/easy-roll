import { EntityId, EntityWithState } from '../../domain/common/types'

export type Repository<TModel extends EntityWithState<TState>, TState extends object> = {
  pulse: () => void
  getAll: () => Readonly<Array<TModel>>
  getById: (id: EntityId) => TModel | undefined
  insert: (item: TModel) => void
  update: (item: TModel) => void
  deleteById: (id: EntityId) => void
}