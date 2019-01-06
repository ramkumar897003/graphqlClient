import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { graphql } from 'react-apollo';
import BookDetails from './BookDetails';

const getBooksQuery = gql`
    {
        books {
            id
            name
        }
    }
`;

class BookList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: null
        }
    }
    displayBooks = () => {
        let data = this.props.data;

        if(data.loading) {
            return <div>Loading Books...</div>
        } else {
            return data.books.map(book => <li key={book.id} onClick={() => this.setState({ selected: book.id })}>{book.name}</li>)
        }
    }

    render() { 
        return(
            <div>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>
                <BookDetails bookId={this.state.selected} />
            </div>
        )
    }
}

export default graphql(getBooksQuery)(BookList);