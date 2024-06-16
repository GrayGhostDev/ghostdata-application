// /frontend/src/components/Pagination.tsx

import React from "react";

interface PaginationProps {
  transactionsPerPage: number;
  totalTransactions: number;
  paginate: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ transactionsPerPage, totalTransactions, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTransactions / transactionsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className="page-item">
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
