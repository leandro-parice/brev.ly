export class DuplicateShortenedLink extends Error {
	constructor() {
		super('Link encurtado já está em uso!') //Shortened link already exists
	}
}
