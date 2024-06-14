import React from 'react'
import { PaginationData } from '../../types/Pagination'
import { functionChange } from '../../type';

interface PagingProps {
  paging: PaginationData;
  onChangePage: functionChange
}

const Pagination: React.FC<PagingProps> = (props: PagingProps) => {
  const { paging, onChangePage } = props;
  const renderPagination = () => {
    if (paging && paging.itemsPerPage !== undefined) {
      const pagingElement = []
      pagingElement.push(
        <li key='prev' className={paging?.prevPage ? "page-item" : "page-item disabled"}>
          <a className="page-link" onClick={() => onChangePage(paging.currentPage - 1)}>&laquo;</a>
        </li>
      );

      for (let i = 1; i <= paging.lastPage; i++) {
        pagingElement.push(
          <li className={paging?.currentPage == i ? "page-item active" : "page-item"} key={i}><a onClick={() => onChangePage(i)} className="page-link" href="#">{i}</a></li>
        );
      }

      pagingElement.push(
        <li key="next" className={paging?.nextPage ? "page-item" : "page-item disabled"}>
          <a className="page-link" onClick={() => onChangePage(paging.currentPage + 1)}>&raquo;</a>
        </li>
      );
      return pagingElement;
    }
  }
  return (
    <nav className="text-align-center mt-5">
      <ul className="pagination justify-content-center">{renderPagination()}</ul>
    </nav>
  )
}

export default Pagination