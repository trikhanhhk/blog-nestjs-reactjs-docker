import { ObjectLiteral, SelectQueryBuilder } from "typeorm"

export const renderFilterTimeQuery = (
  queryBuilder: SelectQueryBuilder<ObjectLiteral>,
  from: string | undefined | null,
  to: string | undefined | null,
  queryName: string
) => {
  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    queryBuilder.andWhere(`${queryName}.createdAt >= :fromDate AND ${queryName}.createdAt <= :toDate`, { fromDate, toDate });
  }
}