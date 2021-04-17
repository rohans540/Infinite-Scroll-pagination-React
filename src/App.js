import React, { useState, useRef, useCallback } from 'react';
import useBookSearch from './useBookSearch';

function App() {

  const [query, setQuery] = useState('');
  const [pageNum, setPageNum] = useState(1);

  const { loading, books, hasMore, error } = useBookSearch(query, pageNum);

  const observer = useRef();
  const lastBookElementRef = useCallback(node => {
    if(loading) return;
    if(observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if(entries[0].isIntersecting && hasMore) {
        setPageNum(prevPageNum => prevPageNum + 1);
      }
    })
    if(node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleSearch = event => {
    setQuery(event.target.value);
    setPageNum(1);
  }

  return (
    <>
      <input type="text" value={query} onChange={handleSearch}></input>
      {books.map((book, index) => {
        if(books.length === index + 1) {
          return <div ref={lastBookElementRef} key={book}>{book}</div>
        } else {
          return <div key={book}>{book}</div>
        }
      })}
      <div>{loading && 'Loading...'}</div>
      <div>{error && 'Error'}</div>
    </>
  );
}

export default App;
