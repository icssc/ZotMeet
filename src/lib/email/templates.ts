type InviteEmailInput = {
	title: string;
	message: string;
	url: string;
};

export function createInviteEmail({ title, message, url }: InviteEmailInput) {
	return {
		subject: title,
		text: `${message}\n\nOpen ZotMeet: ${url}`,
		html: `
        <div>
          <h1>${title}</h1>
          <p>${message}</p>
          <p>
            <a href="${url}">Open ZotMeet</a>
          </p>
        </div>
      `,
	};
}
