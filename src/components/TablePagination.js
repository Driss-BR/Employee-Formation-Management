import Pagination from "react-bootstrap/Pagination";

function getVisiblePaginationItems(currentPage, totalPages, maxVisible = 2) {
  
  const pages = new Set();
  
  pages.add(1); 
  if (Number(totalPages) > 1) {
    pages.add(totalPages);
  }
  
  for (let i = Number(currentPage) - maxVisible; i <= currentPage + maxVisible; i++) {
    if (i > 1 && i < totalPages) {
      pages.add(i);
    }
  }

  const sortedPages = Array.from(pages).sort((a, b) => a - b);
  const finalItems = [];
  let lastPage = 0;

  for (const page of sortedPages) {
    if (page - lastPage > 1) {
      finalItems.push('...');
    }
    finalItems.push(page);
    lastPage = page;
  }

  return finalItems;
}

export default function PaginationList({ nbPage, active, setActive }) {
  const visibleItems = getVisiblePaginationItems(active, nbPage);

  const handlePrev = () => {
    if (active > 1) {
      setActive(active - 1);
    }
  };

  const handleNext = () => {
    if (active < nbPage) {
      setActive(active + 1);
    }
  };

  return (
    <div className="d-flex justify-content-center">
    <Pagination >
      <Pagination.Prev
        onClick={handlePrev}
        disabled={active === 1}
      />

      {visibleItems.map((item, index) => {

        if (item === '...') {
          return <Pagination.Ellipsis key={`ellipsis-${index}`} />;
        }


        return (
          <Pagination.Item
            key={item}
            active={item === active}
            onClick={() => setActive(item)}
          >
            {item}
          </Pagination.Item>
        );
      })}

      <Pagination.Next
        onClick={handleNext}
        disabled={active === nbPage}
      />
    </Pagination>
    </div>
  );
}