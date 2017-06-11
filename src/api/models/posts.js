export class Posts {
  constructor({ connector }) {
    this.connector = connector;
  }

  getPostByID(id) {
    return this.connector.get(`/posts/${id}`).then((result) => result);
  }
}
