import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'

class SearchBooks extends Component {
    state = {
        query: '',
        searchResults: []
    }

    handleInput = (inputValue) => {
        // set query
        this.updateQuery(inputValue)

        // get search results
        this.getSearchResults(inputValue)

    }

    // set query
    updateQuery = (inputValue) => {
        this.setState({query: inputValue.trim()})
    }

    // save search results into an array
    storeBooksFromSearch = (booksFound) => {
        this.props.updateSearchResults(booksFound)
    }

    // call BooksAPI with the user typed query
    getSearchResults = (query) => {
        if(query) {
            BooksAPI.search(query).then(booksInSearchResult => {
                if(booksInSearchResult.length) {
                    this.props.books.map((shelvedBook) => {
                        booksInSearchResult.map((bookInSearchResult) => {
                            bookInSearchResult.shelf = 'none'
                            if(bookInSearchResult.id === shelvedBook.id) {
                                console.log("On Shelf: " + shelvedBook.title + ": " + shelvedBook.shelf)
                                console.log("Search result: " + bookInSearchResult.title + ": " + bookInSearchResult.shelf)
                                bookInSearchResult.shelf = shelvedBook.shelf
                                console.log("Search result: " + bookInSearchResult.title + ": " + bookInSearchResult.shelf)
                            }
                            if(!bookInSearchResult.imageLinks) {
                                bookInSearchResult.imageLinks = 'none'
                            }
                        })
                    })
                    this.storeBooksFromSearch(booksInSearchResult)
                }
            })
        }
    }

    render() {
        const{moveBook, searchResults} = this.props

        return (

            <div className="search-books">
                <div className="search-books-bar">
                    <Link to='/' className="close-search">Close</Link>
                    <div className="search-books-input-wrapper">
                        <input
                            type="text"
                            placeholder="Search by title or author"
                            value={this.state.query}
                            onChange={(event) => this.handleInput(event.target.value)}
                        />
                    </div>
                </div>
                <div className="search-books-results">
                    <ol className="books-grid">
                        {searchResults.map((book) => (
                            <li key={book.id}>
                                <div className="book">
                                    <div className="book-top">
                                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
                                        <div className="book-shelf-changer">
                                            <select value={book.shelf} onChange={(event) => moveBook(event, book)}>
                                                <option value="none" disabled>Move to...</option>
                                                <option value="currentlyReading">Currently Reading</option>
                                                <option value="wantToRead">Want to Read</option>
                                                <option value="read">Read</option>
                                                <option value="none">None</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="book-title">{book.title}</div>
                                    <div className="book-authors">{book.authors}</div>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        )
    }
}

export default SearchBooks