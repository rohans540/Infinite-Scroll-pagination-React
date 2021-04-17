import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useBookSearch(query, pageNum) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [books, setBooks] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        setBooks([]);
    }, [query])
    
    useEffect(() => {
        setLoading(true);
        setError(false);
        let cancel;
        axios({
            method: 'GET',
            url: 'http://openlibrary.org/search.json',
            params: { q: query, page: pageNum },
            cancelToken: new axios.CancelToken(c => cancel = c)
        }).then(resp => {
            setBooks(prevBooks => {
                return [...new Set([...prevBooks, ...resp.data.docs.map(b => b.title)])];
            })
            setHasMore(resp.data.docs.length > 0);
            setLoading(false);
            console.log(resp.data);
        })
        .catch(error => {
            if(axios.isCancel(error)) return;
            setError(true);
        })
        return () => cancel();
    }, [query, pageNum]);

    return {
        loading,
        error,
        books,
        hasMore
    };
}