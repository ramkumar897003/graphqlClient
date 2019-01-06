import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { graphql, compose } from 'react-apollo';

const getAuthorsQuery = gql`
    {
        authors {
            id
            name
        }
    }
`;

const addBookMutation = gql`
    mutation($name: String!, $genre: String!, $authorId: ID!) {
        addBook(name: $name, genre: $genre, authorId: $authorId) {
            id
            name
        }
    }
`;

const getBooksQuery = gql`
    {
        books {
            id
            name
        }
    }
`;

class AddBook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            genre: '',
            authorId: ''
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    displayAuthors = () => {
        let data = this.props.getAuthorsQuery;
        if(data.loading) {
            return <option disabled>Loading Authors...</option>
        } else {
            return data.authors.map(author => <option key={author.id} value={author.id}>{author.name}</option>)
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { name, genre, authorId } = this.state;
        if(!name || !genre || !authorId)
            return alert('All fields are required.');

        this.props.addBookMutation({
            variables: {
                name,
                genre,
                authorId
            },
            refetchQueries: [
                {
                    query: getBooksQuery
                }
            ]
        });
        this.setState({
            name: '',
            genre: '',
            authorId: ''
        })
    }

    render() {
        return(
            <form id="add-book" onSubmit={this.onSubmit}>
                <div className="field">
                    <label>Book Name</label>
                    <input 
                        type="text" 
                        onChange={this.onChange}
                        value={this.state.name}
                        name="name"
                    />
                </div>

                <div className="field">
                    <label>Genre</label>
                    <input 
                        type="text" 
                        onChange={this.onChange}
                        value={this.state.genre}
                        name="genre"
                    />
                </div>

                <div className="field">
                    <label>Book Name</label>
                    <select 
                        onChange={this.onChange}
                        value={this.state.authorId}
                        name="authorId"    
                    >
                        <option>Select Author</option>
                        {this.displayAuthors()}
                    </select>
                </div>
                <button>+</button>
            </form>
        )
    }
}

export default compose(
    graphql(getAuthorsQuery, { name: 'getAuthorsQuery' }),
    graphql(addBookMutation, { name: 'addBookMutation' })
)(AddBook);