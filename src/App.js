import React, { Component} from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import ListBooks from './ListBooks'
import SearchBooks from './SearchBooks'
import {Route} from 'react-router-dom'

class BooksApp extends Component {
  state = {
    books: [],
    currentlyReading: [],
    wantToRead: [],
    read: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((allBooks) => {
      this.setState((state) => ({
        books: allBooks,
        currentlyReading: allBooks.filter((book) => book.shelf === 'currentlyReading'),
        wantToRead: allBooks.filter((book) => book.shelf === 'wantToRead'),
        read: allBooks.filter((book) => book.shelf === 'read')
      }))
    })
  }

  updateShelf = ((event, selectedBook) => {
        BooksAPI.update(selectedBook, event.target.value).then((shelf) => {

            this.setState((state) => ({
                 currentlyReading: state.books.filter((book) => shelf.currentlyReading.includes(book.id)),
                 wantToRead: state.books.filter((book) => shelf.wantToRead.includes(book.id)),
                 read: state.books.filter((book) => shelf.read.includes(book.id)),
                 books: state.currentlyReading.concat(state.wantToRead, state.read)
            }))
        })
    })

  // addBookToShelf = (book, shelf) => {
  //   BooksAPI.update(book, shelf)
  // }

  render() {
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <ListBooks
            books={this.state.books}
            currentlyReading={this.state.currentlyReading}
            wantToRead={this.state.wantToRead}
            read={this.state.read}
            moveBook={this.updateShelf}
          />
        )} />

        <Route exact path='/search' render={({history}) => (
          <SearchBooks
            onAddBookToShelf={(book, shelf) => {
              this.addBookToShelf(book, shelf)
              history.push('/')
            }}
          />
        )} />
      </div>
    )
  }
}

export default BooksApp