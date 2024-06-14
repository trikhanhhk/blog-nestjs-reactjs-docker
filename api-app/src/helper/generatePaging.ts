export class Pagination {
  itemsPerPage: number;
  currentPage: number;
  lastPage: number;
  nextPage: number;
  prevPage: number;
  itemCount: number;
}


export const renderPagingResponse = (itemPerPage: number, page: number, total: number): Pagination => {
  const itemsPerPage = Number(itemPerPage) || 10;
  const currentPage = Number(page) || 1;
  const lastPage = Math.ceil(total / itemsPerPage);
  const nextPage = currentPage + 1 > lastPage ? null : currentPage + 1;
  const prevPage = currentPage - 1 < 1 ? null : currentPage - 1;
  const itemCount = total;

  return { itemsPerPage, currentPage, lastPage, nextPage, prevPage, itemCount };
}

export const renderQueryPaging = (query: any) => {
  const itemPerPage = query.itemPerPage || 10;
  const page = query.page || 1;
  const skip = (page - 1) * itemPerPage;
  return { itemPerPage, skip };
} 