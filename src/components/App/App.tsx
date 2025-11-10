import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import css from './App.module.css';
import SearchBox from '../SearchBox/SearchBox';
import Pagination from '../Pagination/Pagination';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import { fetchNotes } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';


const PER_PAGE = 12;

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const { data, isLoading, isError, isFetching } =
    useQuery<FetchNotesResponse>({
      queryKey: ['notes', page, debouncedSearch],
      queryFn: () =>
        fetchNotes({
          page,
          perPage: PER_PAGE,
          search: debouncedSearch || undefined,
        }),
    });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); 
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const showList = notes.length > 0;
  const showPagination = totalPages > 1;

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />

        {showPagination && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={handleOpenModal}
        >
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && showList && <NoteList notes={notes} />}
      {isFetching && !isLoading && <Loader />}

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
